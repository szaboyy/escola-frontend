import React, { useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";

export function DefaultersPage() {
  const { installments, students, guardians } = useAppContext();

  // 1. O useMemo garante que os cálculos só aconteçam se os dados mudarem
  const defaultersData = useMemo(() => {
    return installments
      .filter((inst) => inst.status === "Atrasado")
      .map((installment) => {
        const student = students.find((s) => s.id === installment.studentId);
        const guardian = guardians.find((g) => g.id === student?.guardianId);

        return {
          installmentId: installment.id,
          studentName: student?.nome || "Aluno não encontrado",
          guardianName: guardian?.nome || "Sem responsável",
          guardianPhone: guardian?.telefone || "-",
          valor: installment.valor,
          vencimento: installment.vencimento,
        };
      });
  }, [installments, students, guardians]);

  // Função utilitária para Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função utilitária para Data (Padronizada e robusta)
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <section style={cardStyle}>
      <h2 style={titleStyle}>Página de Inadimplentes</h2>
      <p style={descriptionStyle}>
        Acompanhamento de mensalidades vencidas e contato dos responsáveis para cobrança.
      </p>

      {defaultersData.length === 0 ? (
        <div style={emptyStateStyle}>
          Nenhuma mensalidade em atraso encontrada.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "24px" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
              <th style={tableHeaderStyle}>Aluno</th>
              <th style={tableHeaderStyle}>Responsável</th>
              <th style={tableHeaderStyle}>Contato</th>
              <th style={tableHeaderStyle}>Valor Devido</th>
              <th style={tableHeaderStyle}>Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {defaultersData.map((data) => (
              <tr
                key={data.installmentId}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td style={tableCellStyle}>{data.studentName}</td>
                <td style={tableCellStyle}>{data.guardianName}</td>
                <td style={tableCellStyle}>{data.guardianPhone}</td>
                <td style={{ ...tableCellStyle, color: "#991b1b", fontWeight: 600 }}>
                  {formatCurrency(data.valor)}
                </td>
                <td style={tableCellStyle}>{formatDate(data.vencimento)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// Estilização
const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "22px",
  marginBottom: "8px",
  color: "#111827",
};

const descriptionStyle: React.CSSProperties = {
  color: "#4b5563",
  lineHeight: 1.6,
};

const emptyStateStyle: React.CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  textAlign: "center",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  color: "#6b7280",
  fontStyle: "italic",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "14px 12px",
  fontSize: "14px",
  color: "#374151",
};

const tableCellStyle: React.CSSProperties = {
  padding: "14px 12px",
  fontSize: "14px",
  color: "#4b5563",
};