type Guardian = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

type GuardiansTableProps = {
  guardians: Guardian[];

  onViewGuardian: (guardian: Guardian) => void;

  onEditGuardian: (guardian: Guardian) => void;

  onDeleteGuardian: (guardianId: number) => void;
};

export function GuardiansTable({
  guardians,
  onViewGuardian,
  onEditGuardian,
  onDeleteGuardian,
}: GuardiansTableProps) {
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

            <th style={tableHeaderStyle}>CPF</th>

            <th style={tableHeaderStyle}>Telefone</th>

            <th style={tableHeaderStyle}>Email</th>

            <th style={tableHeaderStyle}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {guardians.map((guardian) => (
            <tr
              key={guardian.id}
              style={{
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <td style={tableCellStyle}>
                {guardian.nome}
              </td>

              <td style={tableCellStyle}>
                {guardian.cpf}
              </td>

              <td style={tableCellStyle}>
                {guardian.telefone}
              </td>

              <td style={tableCellStyle}>
                {guardian.email}
              </td>

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() =>
                      onViewGuardian(guardian)
                    }
                    style={actionButtonStyle}
                  >
                    Ver
                  </button>

                  <button
                    onClick={() =>
                      onEditGuardian(guardian)
                    }
                    style={actionButtonStyle}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      onDeleteGuardian(guardian.id)
                    }
                    style={deleteButtonStyle}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
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