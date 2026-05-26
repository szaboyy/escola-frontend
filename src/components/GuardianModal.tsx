type Guardian = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

type GuardianModalProps = {
  guardian: Guardian | null;

  onClose: () => void;
};

export function GuardianModal({
  guardian,
  onClose,
}: GuardianModalProps) {
  if (!guardian) {
    return null;
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>
          Detalhes do responsável
        </h2>

        <div style={contentStyle}>
          <p>
            <strong>Nome:</strong>{" "}
            {guardian.nome}
          </p>

          <p>
            <strong>CPF:</strong>{" "}
            {guardian.cpf}
          </p>

          <p>
            <strong>Telefone:</strong>{" "}
            {guardian.telefone}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {guardian.email}
          </p>
        </div>

        <button
          onClick={onClose}
          style={buttonStyle}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "32px",
  width: "420px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "24px",
};

const contentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  fontSize: "18px",
  color: "#1e293b",
  marginBottom: "28px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "14px 22px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
};