import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";

export function ClassesPage() {
  const { classes, setClasses } = useAppContext();
  const [newClassName, setNewClassName] = useState("");

  // Esta função pega o que você digitou no input e envia para o banco
  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const response = await axios.post('http://localhost:3333/classes', { 
        nome: newClassName 
      });
      
      // Atualiza a tela com o dado real que voltou do banco
      setClasses([...classes, response.data]);
      setNewClassName(""); // Limpa o campo
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar a turma no banco de dados.");
    }
  }

  // Esta função deleta do banco e remove da tela
  async function handleDeleteClass(id: number) {
    try {
      await axios.delete(`http://localhost:3333/classes/${id}`);
      setClasses(classes.filter(item => item.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir a turma.");
    }
  }

  return (
    <section style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Gerenciamento de Turmas</h2>
      
      {/* Formulário para adicionar nova turma */}
      <form onSubmit={handleAddClass} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          placeholder="Nome da nova turma (ex: 3º Ano C)" 
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", flex: 1 }}
        />
        <button 
          type="submit" 
          style={{ padding: "12px 20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}
        >
          Adicionar
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "12px" }}>Nome da Turma</th>
            <th style={{ padding: "12px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px" }}>{c.nome}</td>
              <td style={{ padding: "12px" }}>
                <button 
                  onClick={() => handleDeleteClass(c.id)}
                  style={{ color: "#b91c1c", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}