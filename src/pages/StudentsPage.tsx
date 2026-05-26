import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";

export function StudentsPage() {
  const { students, setStudents, classes, guardians } = useAppContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);

  // Estados do Form
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [classId, setClassId] = useState("");
  const [guardianId, setGuardianId] = useState("");
  const [status, setStatus] = useState<"Ativo" | "Inativo">("Ativo");

  async function handleSaveStudent() {
    if (!name || !matricula || classId === "" || guardianId === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (editingStudentId !== null) {
        // EDITAR ALUNO
        const response = await axios.put(`http://localhost:3333/students/${editingStudentId}`, {
          nome: name, matricula, status, classId: Number(classId), guardianId: Number(guardianId)
        });
        setStudents(students.map(s => s.id === editingStudentId ? response.data : s));
      } else {
        // CADASTRAR ALUNO
        const response = await axios.post('http://localhost:3333/students', {
          nome: name, matricula, status, classId: Number(classId), guardianId: Number(guardianId)
        });
        setStudents([...students, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar aluno no banco.");
    }
  }

  async function handleDeleteStudent(id: number) {
    if (!confirm("Deseja excluir este aluno?")) return;
    try {
      await axios.delete(`http://localhost:3333/students/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (error) {
      alert("Erro ao excluir aluno.");
    }
  }

  function handleEdit(s: any) {
    setEditingStudentId(s.id);
    setName(s.nome);
    setMatricula(s.matricula);
    setClassId(s.classId);
    setGuardianId(s.guardianId);
    setStatus(s.status);
    setIsFormVisible(true);
  }

  function resetForm() {
    setName(""); setMatricula(""); setClassId(""); setGuardianId(""); setStatus("Ativo");
    setEditingStudentId(null);
    setIsFormVisible(false);
  }

  return (
    <section>
      <div style={headerContainerStyle}>
        <h2>Alunos</h2>
        <button onClick={() => setIsFormVisible(!isFormVisible)} style={primaryButtonStyle}>
          {isFormVisible ? "Cancelar" : "+ Cadastrar Aluno"}
        </button>
      </div>

      {isFormVisible && (
        <div style={cardStyle}>
          <h3>{editingStudentId ? "Editar Aluno" : "Novo Aluno"}</h3>
          <div style={formGridStyle}>
            <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} style={inputStyle} />
            
            <select value={classId} onChange={(e) => setClassId(e.target.value)} style={inputStyle}>
              <option value="">Selecione a Turma</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <select value={guardianId} onChange={(e) => setGuardianId(e.target.value)} style={inputStyle}>
              <option value="">Selecione o Responsável</option>
              {guardians.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={inputStyle}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <button onClick={handleSaveStudent} style={saveButtonStyle}>Salvar Aluno</button>
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Matrícula</th>
            <th style={thStyle}>Turma</th>
            <th style={thStyle}>Responsável</th>
            <th style={thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const className = classes.find(c => c.id === s.classId)?.nome || "-";
            const guardianName = guardians.find(g => g.id === s.guardianId)?.nome || "-";
            return (
              <tr key={s.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                <td style={tdStyle}>{s.nome}</td>
                <td style={tdStyle}>{s.matricula}</td>
                <td style={tdStyle}>{className}</td>
                <td style={tdStyle}>{guardianName}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(s)} style={editButtonStyle}>Editar</button>
                  <button onClick={() => handleDeleteStudent(s.id)} style={deleteButtonStyle}>Excluir</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

// --- ESTILOS DEFINIDOS PARA RESOLVER OS ERROS ---
const headerContainerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const cardStyle: React.CSSProperties = { backgroundColor: "white", padding: "20px", borderRadius: "16px", marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const formGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" };
const inputStyle: React.CSSProperties = { padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" };
const primaryButtonStyle: React.CSSProperties = { padding: "10px 20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" };
const saveButtonStyle: React.CSSProperties = { padding: "12px 20px", backgroundColor: "#059669", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const tableStyle: React.CSSProperties = { width: "100%", backgroundColor: "white", borderRadius: "16px", padding: "20px", borderCollapse: "collapse" };
const thStyle: React.CSSProperties = { padding: "12px" };
const tdStyle: React.CSSProperties = { padding: "12px" };
const editButtonStyle: React.CSSProperties = { backgroundColor: "#eff6ff", color: "#1d4ed8", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginRight: "5px" };
const deleteButtonStyle: React.CSSProperties = { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" };