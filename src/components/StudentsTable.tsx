import React from "react";
// Lembre-se de ajustar o caminho do import conforme a sua estrutura de pastas
import { useAppContext } from "../contexts/AppContext"; 

type Student = {
  id: number;
  nome: string;
  matricula: string;
  turma: string;
  guardianId: number; // Atuando como nossa chave estrangeira
  status: "Ativo" | "Inativo";
};

type StudentsTableProps = {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: number) => void;
};

export function StudentsTable({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentsTableProps) {
  // Puxando a "tabela" de responsáveis do estado global
  const { guardians } = useAppContext();

  return (
    <div style={cardStyle}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <th style={tableHeaderStyle}>Nome</th>
            <th style={tableHeaderStyle}>Matrícula</th>
            <th style={tableHeaderStyle}>Turma</th>
            <th style={tableHeaderStyle}>Responsável</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => {
            // Aqui fazemos a agregação de dados: buscando o responsável dono deste ID
            const guardian = guardians.find((g) => g.id === student.guardianId);

            return (
              <tr
                key={student.id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <td style={tableCellStyle}>{student.nome}</td>
                <td style={tableCellStyle}>{student.matricula}</td>
                <td style={tableCellStyle}>{student.turma}</td>
                
                {/* Exibindo o nome encontrado ou um aviso caso o ID não exista */}
                <td style={tableCellStyle}>
                  {guardian ? guardian.nome : "Não encontrado"}
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
                        student.status === "Ativo" ? "#dcfce7" : "#fee2e2",
                      color: student.status === "Ativo" ? "#166534" : "#991b1b",
                    }}
                  >
                    {student.status}
                  </span>
                </td>

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => onViewStudent(student)}
                      style={actionButtonStyle}
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => onEditStudent(student)}
                      style={actionButtonStyle}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      style={deleteButtonStyle}
                    >
                      Excluir
                    </button>
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

// Estilos mantidos intactos
const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  marginBottom: "20px",
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

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};