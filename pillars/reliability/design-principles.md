# Reliability & Resilience — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Reliability pillar.

---

## R-1. Treat LaunchDarkly as a soft dependency

If the LaunchDarkly service is unreachable for ten minutes, your product should keep serving users. The SDK returns the fallback value; the application uses it; the user experience is *almost* the same.

If your answer to "what happens if LaunchDarkly is unreachable" is "we go down," that's the most important thing to fix in your system.

## R-2. Defaults are part of the application

Every fallback value passed to the SDK is a deliberate product decision. The application is tested with the fallback value. The fallback value is the value you'd want to be serving during an outage.

A fallback chosen carelessly in a one-line code change is a future incident.

## R-3. The SDK is in your control, even when it can't reach LaunchDarkly

LaunchDarkly's SDKs are designed for graceful degradation: they cache, they retry, they expose offline mode, they accept bootstrap data. Use those capabilities deliberately. The SDK is a piece of your application, not a remote-service stub.

## R-4. Relay Proxy is for the cases where the SDK shouldn't talk directly to LaunchDarkly

The Relay Proxy is a tool: it centralizes outbound traffic, supports daemon mode for systems that can't hold streaming connections, enables offline / restricted-egress deployments, and reduces tail latency. Use it when it solves a real problem; don't deploy it because "it sounds safer."

When you do deploy it, run it like any other production service — multi-instance, multi-AZ, monitored, capacity-planned.

## R-5. Plan for the AI provider to fail

Every AI Config call goes through one or more LLM providers, each of which has its own SLO, its own failure modes, and its own degradation patterns. Plan for them to fail. Wire fallbacks. Use multiple providers where the risk justifies it.

## R-6. Test failure modes deliberately

The team has run a drill in production where LaunchDarkly is unreachable. The team has run a drill where the Relay Proxy is degraded. The team has run a drill where the LLM provider returns garbage. The team knows what happens.

Without drills, "we degrade gracefully" is a hypothesis. With drills, it's a property.

## R-7. Resilience is per system, not per company

Some workloads need five-nines availability; others can tolerate brief degradation. Don't impose the same resilience posture on every system. The right posture is the one that matches the workload's actual requirements.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
