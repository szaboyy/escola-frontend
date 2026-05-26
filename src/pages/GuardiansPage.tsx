import { useState } from "react";
import axios from "axios";
import { GuardianModal } from "../components/GuardianModal";
import { GuardiansTable } from "../components/GuardiansTable";
import { useAppContext } from "../contexts/AppContext";

type Guardian = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

export function GuardiansPage() {
  const { guardians, setGuardians } = useAppContext();
  
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingGuardianId, setEditingGuardianId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  async function handleSaveGuardian() {
    if (!nome || !cpf || !telefone || !email) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      if (editingGuardianId !== null) {
        // EDITAR
        const response = await axios.put(`http://localhost:3333/guardians/${editingGuardianId}`, { 
          nome, cpf, telefone, email 
        });
        setGuardians(guardians.map(g => g.id === editingGuardianId ? response.data : g));
      } else {
        // CADASTRAR
        const response = await axios.post('http://localhost:3333/guardians', { 
          nome, cpf, telefone, email 
        });
        setGuardians([...guardians, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar responsável.");
    }
  }

  function handleEditGuardian(guardian: Guardian) {
    setEditingGuardianId(guardian.id);
    setNome(guardian.nome);
    setCpf(guardian.cpf);
    setTelefone(guardian.telefone);
    setEmail(guardian.email);
    setIsFormVisible(true);
  }

  async function handleDeleteGuardian(guardianId: number) {
    if (!confirm("Deseja excluir este responsável?")) return;

    try {
      await axios.delete(`http://localhost:3333/guardians/${guardianId}`);
      setGuardians(guardians.filter(g => g.id !== guardianId));
    } catch (error) {
      alert("Erro ao excluir. O responsável pode estar vinculado a um aluno.");
    }
  }

  function resetForm() {
    setNome(""); setCpf(""); setTelefone(""); setEmail("");
    setIsFormVisible(false);
    setEditingGuardianId(null);
  }

  const filteredGuardians = guardians.filter((g) => 
    g.nome.toLowerCase().includes(search.toLowerCase()) || g.cpf.includes(search)
  );

  return (
    <section>
      <div style={headerContainerStyle}>
        <div>
          <h2 style={titleStyle}>Responsáveis</h2>
          <p style={subtitleStyle}>Gerencie os responsáveis dos alunos.</p>
        </div>
        <button onClick={() => { resetForm(); setIsFormVisible(true); }} style={primaryButtonStyle}>
          + Cadastrar responsável
        </button>
      </div>

      <GuardianModal guardian={selectedGuardian} onClose={() => setSelectedGuardian(null)} />

      {isFormVisible && (
        <div style={cardStyle}>
          <h3 style={formTitleStyle}>{editingGuardianId !== null ? "Editar responsável" : "Novo responsável"}</h3>
          <div style={formGridStyle}>
            <div><label style={labelStyle}>Nome</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>CPF</label><input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Telefone</label><input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handleSaveGuardian} style={primaryButtonStyle}>
              {editingGuardianId !== null ? "Salvar alterações" : "Salvar responsável"}
            </button>
            <button onClick={resetForm} style={secondaryButtonStyle}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <input type="text" placeholder="Buscar responsável por nome ou CPF" value={search} onChange={(e) => setSearch(e.target.value)} style={searchInputStyle} />
      </div>

      <GuardiansTable 
        guardians={filteredGuardians} 
        onViewGuardian={(g) => setSelectedGuardian(g)}
        onEditGuardian={handleEditGuardian}
        onDeleteGuardian={handleDeleteGuardian}
      />
    </section>
  );
}

// Estilos
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