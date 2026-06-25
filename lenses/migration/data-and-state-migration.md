# Data & State Migration

Migrations that change the underlying data — schema changes, storage swaps, message-bus changes, encoding changes — are fundamentally harder than migrations of code paths alone. This page covers the additional patterns required.

The core problem: code is reversible (revert the deploy); data is not (once you've written to the new store, you can't un-write). Data migrations need patterns that preserve the option to roll back until the team is sure the new state is correct.

---

## The taxonomy of data migrations

Different data migrations need different patterns:

| Type | Example | Key challenge |
|---|---|---|
| **Schema-additive** | New column added; old column still present | Easy — backward-compatible by construction |
| **Schema-evolved** | Column renamed / restructured | Medium — need transition period with both shapes |
| **Storage-swap** | Postgres → MongoDB; Redis → DynamoDB | Hard — different storage characteristics; dual-write required |
| **Provider-swap** | AWS RDS → GCP Cloud SQL | Hard — different network paths, different ops |
| **Sharded-to-unsharded (or vice versa)** | Multi-DB consolidation; or splitting one DB | Very hard — operational topology changes |
| **Encoding / format** | JSON → Protocol Buffers; UTF-8 → UTF-16 | Hard — every read and write path must handle both during transition |

The patterns below apply more strongly to the harder migrations.

---

## Pattern 1 — Schema-additive (the easy case)

**Shape.** Add the new column (or field). Existing code ignores it. New code reads or writes it.

**LD use.** Often no flag needed — the schema change itself is backward-compatible. A flag may gate the new code's behavior that exercises the new column.

**Properties:**

- Reversible (drop the column).
- No dual-write needed.
- Standard rollout discipline applies to the code that uses the new column.

This is the migration teams should aspire to make their data migrations look like, when possible.

---

## Pattern 2 — Dual-write + dual-read (the standard pattern for harder migrations)

**Shape.** During the migration, the application writes to *both* the old and new data stores. Reads can come from either. Cutover proceeds:

1. **Phase: write-old-only (baseline).** Only the old store is written or read. Steady state before migration.
2. **Phase: dual-write, read-old.** Application writes to both stores. Reads come from old. New store is being populated.
3. **Phase: dual-write, read-new-shadow.** Application writes to both, reads from new for shadow purposes but serves old's result. Verify the new store has the right data.
4. **Phase: dual-write, read-new.** Application writes to both, serves new's reads. Old store is the safety net.
5. **Phase: write-new-only, read-new.** Application writes only to new. Old store is read-only fallback.
6. **Phase: new-only.** Old store decommissioned.

**Flag patterns:**

```pseudocode
write_target = ldclient.stringVariation("migration-data-write-mode", context, "old-only")
// "old-only" | "dual-write" | "new-only"

read_target = ldclient.stringVariation("migration-data-read-mode", context, "old")
// "old" | "new-shadow" | "new"
```

Two flags, not one — they progress independently. Dual-write must be established before read-new begins.

**Backfill considerations.** Records that existed before dual-write started won't be in the new store. A separate backfill process migrates historical data. The backfill is itself a migration — design and run it carefully.

**Cutover criteria.** Move from dual-write to write-new-only when:

- The new store has been receiving all writes for long enough that backfill is complete.
- Sample reads from the new store match expected values.
- The team has confidence the new store is the new system of record.

---

## Pattern 3 — Shadow reads with comparison

**Shape.** While in "dual-write, read-old," every read also queries the new store and compares. Discrepancies are logged.

```pseudocode
case "new-shadow":
  old_value = read_from_old_store(key)
  try:
    new_value = read_from_new_store(key)
    if not equivalent(old_value, new_value):
      log_read_divergence(key, old_value, new_value)
  except Exception as e:
    log_shadow_read_failure(key, e)
  return old_value
```

Shadow reads catch:

- Data that didn't get backfilled.
- Bugs in dual-write that produced inconsistent values.
- Encoding or formatting differences between the stores.
- Race conditions in dual-write that occasionally lose updates.

**Exit criteria.** Read divergence rate at acceptable threshold for the migration's equivalence rule.

---

## Pattern 4 — The point of no return

Most data migrations have a phase after which the old store can't be brought back as the system of record. Crossing this point is a deliberate decision.

Typically the point of no return is **when writes stop going to the old store** (the move from dual-write to write-new-only). After that, the old store starts going stale; any rollback would lose all the writes that happened since cutover.

**Discipline around the point of no return:**

- Document it as a distinct phase boundary in the migration plan.
- Require an explicit go/no-go decision before crossing it. Approvers, criteria, captured rationale.
- Make the dual-write phase last long enough to be highly confident.
- Plan a rollback procedure for the case where post-cutover the team discovers a critical issue — even if rollback means losing some writes, the team should know what they'd be losing.

---

## Pattern 5 — Backfill

For data that existed before dual-write started, a backfill process copies it from old to new. The backfill is an independent migration with its own concerns:

- **Throughput.** Backfilling at scale (millions or billions of records) takes time. Plan for it; throttle to avoid impacting production.
- **Consistency.** Records modified during backfill need correct handling. Either pause writes (rarely viable), or use a copy-then-reconcile pattern (read, copy, then reconcile any changes that happened during the copy).
- **Verification.** Confirm post-backfill that the new store has every record from the old store. Spot-check; full-comparison if possible.
- **Idempotency.** The backfill may need to be restarted; design it to be safely re-runnable.

Backfill isn't gated by the migration flag (it operates on data, not on application paths), but it's part of the migration plan.

---

## Pattern 6 — The B2B per-tenant data migration

For SaaS workloads with per-tenant data isolation, the migration can proceed per-tenant. Each tenant's data is migrated, validated, and cut over independently.

**Advantages:**

- Per-tenant rollback is feasible.
- Per-tenant communication and coordination is possible.
- Smaller per-cutover blast radius.

**Configuration:**

```pseudocode
tenant_migration_state = ldclient.stringVariation(
  "migration-tenant-data-state",
  { kind: "organization", key: tenant_id },
  "old"
)
// "old" | "backfilling" | "dual-write" | "new-shadow" | "new" | "decommissioned"
```

Each tenant moves through the states. The migration tool / runbook tracks which tenants are in which phase.

---

## Pattern 7 — Streaming / event-driven systems

For migrations involving message buses or event streams, the equivalent patterns:

- **Dual-publish.** During migration, events are published to both old and new buses.
- **Dual-consume.** Critical consumers read from both during shadow; later transition to new.
- **Per-event-type migration.** Different event types can migrate at different paces.

Sequencing matters: don't switch a consumer to the new bus until the new bus has been receiving publishes long enough for the consumer's historical needs.

---

## Pattern 8 — Encoding / format migration

For migrations changing the on-the-wire format (e.g., JSON → Protobuf, custom binary → standard):

- Application writes the new format; readers can decode both during transition.
- A separate rewrite job migrates existing data to the new format.
- Once all data is in the new format and confirmed, drop the old-format decoder.

This is essentially the dual-write pattern at the encoding layer.

---

## Validating equivalence at the data layer

The equivalence question is sharper for data migrations than for code-path migrations. What does "the new store has the right data" mean?

Practical validations:

- **Count-equivalence.** Number of records in old and new match (after accounting for in-flight writes).
- **Hash-equivalence.** For static data, hashes of (sorted) record sets match.
- **Sample-equivalence.** Random sample of N records in old also exists in new with equivalent fields.
- **Read-traffic equivalence.** Shadow reads produce equivalent results at acceptable rate.
- **Downstream-output equivalence.** Operations that depend on the data produce the same outputs.

Most migrations need several of these. A migration that passes only count-equivalence has confirmed almost nothing.

---

## Reverse migration

In rare cases, the team needs to undo a data migration after the point of no return — e.g., the new store has a fundamental problem that wasn't surfaced during shadow. The reverse migration is itself a migration: dual-write back to old, validate, cut over to old.

Plan for it if the workload is high-stakes. Hope you never need it.

---

## Schema versioning

For migrations that involve evolving schemas over a long period (multiple schema changes, multiple rollouts), maintain a schema version per record. Records with the old version are readable by both old and new code (with old code's behavior); records with new version are written by new code.

The migration is: gradually rewrite records to the new schema while both versions coexist. The flag controls whether the new code uses new or old schema semantics for a given record.

This is more involved than dual-write but works for evolutions where dual-write isn't viable (e.g., schema changes that change uniqueness constraints).

---

## What good looks like

A well-run data migration has these properties:

- Phased explicitly, with documented criteria per phase exit.
- Dual-write established before any read shifts.
- Shadow reads validating equivalence before cutover.
- A documented, approved point-of-no-return decision.
- Backfill validated for completeness and correctness.
- Per-tenant or per-cohort granularity where applicable.
- Warm period after cutover with old store still operational.
- Retirement only after extended warm period and stakeholder sign-off.

---

← [Strangler-Fig at Scale](./strangler-fig-at-scale.md) | Continue to → [Review Questions](./review-questions.md)
