import { useState } from "react";
import axios from "axios";
import { InstallmentModal } from "../components/InstallmentModal";
import { InstallmentsTable } from "../components/InstallmentsTable";
import { useAppContext } from "../contexts/AppContext";

type Installment = {
  id: number;
  studentId: number;
  valor: number;
  vencimento: string;
  status: "Pago" | "Pendente" | "Atrasado";
};

export function InstallmentsPage() {
  const { installments, setInstallments, students } = useAppContext();

  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingInstallmentId, setEditingInstallmentId] = useState<number | null>(null);

  const [studentId, setStudentId] = useState<number | "">("");
  const [valor, setValor] = useState<number | "">("");
  const [vencimento, setVencimento] = useState("");
  const [status, setStatus] = useState<"Pago" | "Pendente" | "Atrasado">("Pendente");
  const [search, setSearch] = useState("");

  async function handleSaveInstallment() {
    if (studentId === "" || valor === "" || !vencimento) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      if (editingInstallmentId !== null) {
        // EDITAR
        const response = await axios.put(`http://localhost:3333/installments/${editingInstallmentId}`, {
          studentId, valor, vencimento, status
        });
        setInstallments(installments.map(i => i.id === editingInstallmentId ? response.data : i));
      } else {
        // CRIAR
        const response = await axios.post('http://localhost:3333/installments', {
          studentId, valor, vencimento, status
        });
        setInstallments([...installments, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar mensalidade:", error);
      alert("Erro ao salvar no banco.");
    }
  }

  function handleEditInstallment(installment: Installment) {
    setEditingInstallmentId(installment.id);
    setStudentId(installment.studentId);
    setValor(installment.valor);
    setVencimento(installment.vencimento);
    setStatus(installment.status);
    setIsFormVisible(true);
  }

  async function handleDeleteInstallment(installmentId: number) {
    if (!confirm("Deseja excluir esta mensalidade?")) return;

    try {
      await axios.delete(`http://localhost:3333/installments/${installmentId}`);
      setInstallments(installments.filter(i => i.id !== installmentId));
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }

  function resetForm() {
    setStudentId(""); setValor(""); setVencimento(""); setStatus("Pendente");
    setEditingInstallmentId(null);
    setIsFormVisible(false);
  }

  const filteredInstallments = installments.filter((installment) => {
    const student = students.find((s) => s.id === installment.studentId);
    return student?.nome.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <section>
      <div style={headerContainerStyle}>
        <div>
          <h2 style={titleStyle}>Mensalidades</h2>
          <p style={subtitleStyle}>Gerencie as mensalidades escolares.</p>
        </div>
        <button onClick={() => { resetForm(); setIsFormVisible(true); }} style={primaryButtonStyle}>
          + Nova mensalidade
        </button>
      </div>

      <InstallmentModal installment={selectedInstallment} onClose={() => setSelectedInstallment(null)} />

      {isFormVisible && (
        <div style={cardStyle}>
          <h3 style={formTitleStyle}>{editingInstallmentId !== null ? "Editar mensalidade" : "Nova mensalidade"}</h3>
          <div style={formGridStyle}>
            <div>
              <label style={labelStyle}>Aluno</label>
              <select value={studentId} onChange={(e) => setStudentId(Number(e.target.value))} style={inputStyle}>
                <option value="">Selecione um aluno</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Valor (R$)</label>
              <input type="number" step="0.01" value={valor} onChange={(e) => setValor(Number(e.target.value))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Vencimento</label>
              <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={inputStyle}>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handleSaveInstallment} style={primaryButtonStyle}>Salvar</button>
            <button onClick={resetForm} style={secondaryButtonStyle}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <input type="text" placeholder="Buscar mensalidade por aluno" value={search} onChange={(e) => setSearch(e.target.value)} style={searchInputStyle} />
      </div>

      <InstallmentsTable 
        installments={filteredInstallments}
        onViewInstallment={(i) => setSelectedInstallment(i)}
        onEditInstallment={handleEditInstallment}
        onDeleteInstallment={handleDeleteInstallment}
      />
    </section>
  );
}

// Definição dos estilos que faltavam
const headerContainerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" };
const titleStyle: React.CSSProperties = { fontSize: "28px", color: "#111827", marginBottom: "6px" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", fontSize: "15px" };
const cardStyle: React.CSSProperties = { backgroundColor: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)", marginBottom: "20px" };
const formTitleStyle: React.CSSProperties = { fontSize: "20px", color: "#111827", marginBottom: "16px" };
const formGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" };
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#374151" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" };
const searchInputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" };
const primaryButtonStyle: React.CSSProperties = { backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" };
const secondaryButtonStyle: React.CSSProperties = { backgroundColor: "#e5e7eb", color: "#111827", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" };