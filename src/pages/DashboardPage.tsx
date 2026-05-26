import React from "react";
// Lembre-se de ajustar o caminho da importação
import { useAppContext } from "../contexts/AppContext";

export function DashboardPage() {
  const { students, installments } = useAppContext();

  // 1. Agregações (Equivalente ao COUNT e WHERE)
  const totalStudents = students.length;

  const paidInstallments = installments.filter((i) => i.status === "Pago");
  const pendingInstallments = installments.filter((i) => i.status === "Pendente");
  const lateInstallments = installments.filter((i) => i.status === "Atrasado");

  // 2. Cálculos Financeiros (Equivalente ao SUM)
  const paidAmount = paidInstallments.reduce((acc, curr) => acc + curr.valor, 0);
  const pendingAmount = pendingInstallments.reduce((acc, curr) => acc + curr.valor, 0);
  const lateAmount = lateInstallments.reduce((acc, curr) => acc + curr.valor, 0);
  
  const totalExpected = paidAmount + pendingAmount + lateAmount;

  // 3. Cálculo de Inadimplência (COUNT DISTINCT)
  // Cria um conjunto de IDs únicos de alunos que possuem parcelas atrasadas
  const defaultersCount = new Set(lateInstallments.map((i) => i.studentId)).size;

  // Taxa de inadimplência financeira (%)
  const defaultRate = totalExpected > 0 
    ? ((lateAmount / totalExpected) * 100).toFixed(1) 
    : "0.0";

  // Função utilitária para Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Gerando um "feed" de atividades dinâmico com os últimos 4 registros
  const recentActivities = [...installments]
    .reverse()
    .slice(0, 4)
    .map((inst) => {
      const student = students.find((s) => s.id === inst.studentId);
      const studentName = student ? student.nome : "Aluno removido";

      if (inst.status === "Pago") {
        return `✅ Pagamento recebido de ${studentName} (${formatCurrency(inst.valor)})`;
      }
      if (inst.status === "Atrasado") {
        return `⚠️ Mensalidade vencida de ${studentName}`;
      }
      return `⏳ Mensalidade gerada para ${studentName}`;
    });

  return (
    <section>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Dashboard Financeiro</h1>
          <p style={subtitleStyle}>Visão geral da situação escolar em tempo real.</p>
        </div>
      </div>

      <div style={cardsGridStyle}>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Total de alunos</span>
          <h2 style={cardValueStyle}>{totalStudents}</h2>
          <p style={cardInfoStyle}>Cadastrados no sistema</p>
        </div>

        <div style={cardStyle}>
          <span style={cardLabelStyle}>Mensalidades pagas</span>
          <h2 style={cardValueStyle}>{formatCurrency(paidAmount)}</h2>
          <p style={positiveInfoStyle}>
            {paidInstallments.length} parcelas quitadas
          </p>
        </div>

        <div style={cardStyle}>
          <span style={cardLabelStyle}>Valor pendente</span>
          <h2 style={cardValueStyle}>{formatCurrency(pendingAmount)}</h2>
          <p style={cardInfoStyle}>
            {pendingInstallments.length} aguardando vencimento
          </p>
        </div>

        <div style={cardStyle}>
          <span style={cardLabelStyle}>Inadimplentes</span>
          <h2 style={cardValueStyle}>{defaultersCount}</h2>
          <p style={negativeInfoStyle}>
            {lateInstallments.length} mensalidades atrasadas
          </p>
        </div>
      </div>

      <div style={bottomGridStyle}>
        <div style={largeCardStyle}>
          <h3 style={sectionTitleStyle}>Resumo financeiro</h3>

          <div style={financeRowStyle}>
            <span>Recebido até o momento</span>
            <strong>{formatCurrency(paidAmount)}</strong>
          </div>

          <div style={financeRowStyle}>
            <span>Em aberto (Pendente)</span>
            <strong>{formatCurrency(pendingAmount)}</strong>
          </div>

          <div style={financeRowStyle}>
            <span>Em atraso (Inadimplência)</span>
            <strong style={{ color: "#b91c1c" }}>{formatCurrency(lateAmount)}</strong>
          </div>

          <div style={financeRowStyle}>
            <span>Previsão total do mês</span>
            <strong>{formatCurrency(totalExpected)}</strong>
          </div>

          <div style={financeRowStyle}>
            <span>Taxa de inadimplência (Valor)</span>
            <strong>{defaultRate}%</strong>
          </div>
        </div>

        <div style={largeCardStyle}>
          <h3 style={sectionTitleStyle}>Últimas atividades</h3>
          
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} style={activityItemStyle}>
                {activity}
              </div>
            ))
          ) : (
            <div style={activityItemStyle}>Nenhuma atividade recente.</div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Estilos Mantidos ---
const headerStyle: React.CSSProperties = {
  marginBottom: "32px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "34px",
  fontWeight: 700,
  color: "#111827",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#6b7280",
};

const cardsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
  marginBottom: "24px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
};

const cardValueStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 700,
  color: "#111827",
  marginTop: "12px",
  marginBottom: "12px",
};

const cardInfoStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
};

const positiveInfoStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#15803d",
  fontWeight: 600,
};

const negativeInfoStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#b91c1c",
  fontWeight: 600,
};

const bottomGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const largeCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#111827",
  marginBottom: "20px",
};

const financeRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid #f1f5f9",
  color: "#374151",
};

const activityItemStyle: React.CSSProperties = {
  padding: "14px 0",
  borderBottom: "1px solid #f1f5f9",
  color: "#374151",
  fontSize: "15px",
};