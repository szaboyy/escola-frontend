import React from "react";

type PageName = "dashboard" | "alunos" | "responsaveis" | "turmas" | "mensalidades" | "inadimplentes";

type MainLayoutProps = {
  children: React.ReactNode;
  activePage: PageName;
  onChangePage: (page: PageName) => void;
};

const navLinks: { name: PageName; label: string }[] = [
  { name: "dashboard", label: "Dashboard" },
  { name: "alunos", label: "Alunos" },
  { name: "responsaveis", label: "Responsáveis" },
  { name: "turmas", label: "Turmas" },
  { name: "mensalidades", label: "Mensalidades" },
  { name: "inadimplentes", label: "Inadimplentes" },
];

export function MainLayout({ children, activePage, onChangePage }: MainLayoutProps) {
  return (
    <div style={layoutGridStyle}>
      <aside style={sidebarStyle}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>Financeiro Escolar</h2>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>Sistema de inadimplência</p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {navLinks.map((link) => (
            <SidebarLink 
              key={link.name}
              label={link.label}
              isActive={activePage === link.name}
              onClick={() => onChangePage(link.name)}
            />
          ))}
        </nav>
      </aside>

      <header style={headerStyle}>
        <h1 style={{ fontSize: "22px", color: "#111827" }}>Painel do Sistema</h1>
        <div style={adminBadgeStyle}>Administrador</div>
      </header>

      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: isActive ? 700 : 500,
        backgroundColor: isActive ? "#2563eb" : "transparent",
        color: "#e5e7eb",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

const layoutGridStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gridTemplateRows: "70px 1fr",
  gridTemplateAreas: `"sidebar header" "sidebar content"`,
  backgroundColor: "#f3f4f6",
};

const sidebarStyle: React.CSSProperties = {
  gridArea: "sidebar",
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "24px 20px",
};

const headerStyle: React.CSSProperties = {
  gridArea: "header",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
};

const mainContentStyle: React.CSSProperties = {
  gridArea: "content",
  padding: "24px",
};

const adminBadgeStyle: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: "14px",
};