import React from "react";
// Lembre-se de ajustar o caminho caso necessário
import { useAppContext } from "../contexts/AppContext";

type Installment = {
  id: number;
  studentId: number; // Chave relacional atualizada
  valor: number;
  vencimento: string;
  status: "Pago" | "Pendente" | "Atrasado";
};

type InstallmentModalProps = {
  installment: Installment | null;
  onClose: () => void;
};

export function InstallmentModal({
  installment,
  onClose,
}: InstallmentModalProps) {
  // Puxando os alunos do contexto para fazer o cruzamento de dados
  const { students } = useAppContext();

  if (!installment) {
    return null;
  }

  // Agregação: encontrando o aluno dono desta parcela
  const student = students.find((s) => s.id === installment.studentId);

  // Funções de formatação visual
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (isoString: string) => {
    const [year, month, day] = isoString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            color: "#111827",
          }}
        >
          Detalhes da mensalidade
        </h3>

        <div style={detailsContainerStyle}>
          <p>
            <strong>Aluno:</strong> {student ? student.nome : "Não encontrado"}
          </p>

          <p>
            <strong>Valor:</strong> {formatCurrency(installment.valor)}
          </p>

          <p>
            <strong>Vencimento:</strong> {formatDate(installment.vencimento)}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                display: "inline-block",
                padding: "4px 8px",
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
          </p>
        </div>

        <button onClick={onClose} style={primaryButtonStyle}>
          Fechar
        </button>
      </div>
    </div>
  );
}

// Estilos mantidos
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  width: "420px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const detailsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "24px",
  color: "#374151",
  fontSize: "15px",
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};