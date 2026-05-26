import React from "react";
// Não se esqueça de ajustar o caminho do seu AppContext
import { useAppContext } from "../contexts/AppContext";

type Student = {
  id: number;
  nome: string;
  matricula: string;
  turma: string;
  guardianId: number; // Atualizado para a chave relacional
  status: "Ativo" | "Inativo"; // Atualizado para refletir o status correto do AppContext
};

type StudentModalProps = {
  student: Student | null;
  onClose: () => void;
};

export function StudentModal({
  student,
  onClose,
}: StudentModalProps) {
  // Trazendo os responsáveis do contexto
  const { guardians } = useAppContext();

  if (!student) {
    return null;
  }

  // Agregação: buscando o responsável dono deste ID
  const guardian = guardians.find((g) => g.id === student.guardianId);

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
          Detalhes do aluno
        </h3>

        <div style={detailsContainerStyle}>
          <p>
            <strong>Nome:</strong> {student.nome}
          </p>

          <p>
            <strong>Matrícula:</strong> {student.matricula}
          </p>

          <p>
            <strong>Turma:</strong> {student.turma}
          </p>

          <p>
            <strong>Responsável:</strong> {guardian ? guardian.nome : "Não encontrado"}
          </p>

          <p>
            <strong>Status:</strong> {student.status}
          </p>
        </div>

        <button onClick={onClose} style={primaryButtonStyle}>
          Fechar
        </button>
      </div>
    </div>
  );
}

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