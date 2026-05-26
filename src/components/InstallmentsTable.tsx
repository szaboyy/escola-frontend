import React from "react";
import { useAppContext } from "../contexts/AppContext"; 

type Installment = {
  id: number;
  studentId: number;
  valor: number; 
  vencimento: string; 
  status: "Pago" | "Pendente" | "Atrasado";
};

type InstallmentsTableProps = {
  installments: Installment[];
  onViewInstallment: (installment: Installment) => void;
  onEditInstallment: (installment: Installment) => void;
  onDeleteInstallment: (installmentId: number) => void;
};

export function InstallmentsTable({
  installments,
  onViewInstallment,
  onEditInstallment,
  onDeleteInstallment,
}: InstallmentsTableProps) {
  const { students } = useAppContext();

  // Formata valor como moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formata data ISO para DD/MM/AAAA de forma robusta
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
    <div style={cardStyle}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={tableHeaderStyle}>Aluno</th>
            <th style={tableHeaderStyle}>Valor</th>
            <th style={tableHeaderStyle}>Vencimento</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {installments.map((installment) => {
            const student = students.find((s) => s.id === installment.studentId);

            return (
              <tr key={installment.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={tableCellStyle}>
                  {student ? student.nome : "Não encontrado"}
                </td>

                <td style={tableCellStyle}>
                  {formatCurrency(installment.valor)}
                </td>

                <td style={tableCellStyle}>
                  {formatDate(installment.vencimento)}
                </td>

                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 700,
                      backgroundColor:
                        installment.status === "Pago"
                          ? "#dcfce7"
                          : installment.status === "Pendente"
                          ? "#fef9c3"
                          : "#fee2e2",
                      color:
                        installment.status === "Pago"
                          ? "#166534"
                          : installment.status === "Pendente"
                          ? "#a16207"
                          : "#991b1b",
                    }}
                  >
                    {installment.status}
                  </span>
                </td>

                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => onViewInstallment(installment)} style={actionButtonStyle}>Ver</button>
                    <button onClick={() => onEditInstallment(installment)} style={actionButtonStyle}>Editar</button>
                    <button onClick={() => onDeleteInstallment(installment.id)} style={deleteButtonStyle}>Excluir</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Estilos
const cardStyle: React.CSSProperties = { backgroundColor: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)" };
const tableHeaderStyle: React.CSSProperties = { padding: "14px 12px", fontSize: "14px", color: "#374151" };
const tableCellStyle: React.CSSProperties = { padding: "14px 12px", fontSize: "14px", color: "#4b5563" };
const actionButtonStyle: React.CSSProperties = { backgroundColor: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600 };
const deleteButtonStyle: React.CSSProperties = { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600 };