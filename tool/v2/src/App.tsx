import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { HomePage } from "./pages/HomePage";
import { NewReviewPage } from "./pages/NewReviewPage";
import { WorkbookPage } from "./pages/WorkbookPage";
import { SummaryPage } from "./pages/SummaryPage";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewReviewPage />} />
        <Route path="/workbook" element={<WorkbookPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </AppShell>
  );
}
