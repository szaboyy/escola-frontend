import { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentsPage } from "./pages/StudentsPage";
import { GuardiansPage } from "./pages/GuardiansPage";
import { ClassesPage } from "./pages/ClassesPage";
import { InstallmentsPage } from "./pages/InstallmentsPage";
import { DefaultersPage } from "./pages/DefaultersPage";

type PageName =
  | "dashboard"
  | "alunos"
  | "responsaveis"
  | "turmas"
  | "mensalidades"
  | "inadimplentes";

function App() {
  const [activePage, setActivePage] = useState<PageName>("dashboard");

  function renderPageContent() {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;

      case "alunos":
        return <StudentsPage />;

      case "responsaveis":
        return <GuardiansPage />;

      case "turmas":
        return <ClassesPage />;

      case "mensalidades":
        return <InstallmentsPage />;

      case "inadimplentes":
        return <DefaultersPage />;

      default:
        return null;
    }
  }

  return (
    <MainLayout activePage={activePage} onChangePage={setActivePage}>
      {renderPageContent()}
    </MainLayout>
  );
}

export default App;