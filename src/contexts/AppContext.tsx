import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type Student = {
  id: number;
  nome: string;
  matricula: string;
  classId: number; 
  guardianId: number;
  status: 'Ativo' | 'Inativo';
  class?: { nome: string }; 
  guardian?: { nome: string };
};

type Guardian = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

type Class = {
  id: number;
  nome: string;
};

type Installment = {
  id: number;
  studentId: number;
  valor: number;
  vencimento: string;
  status: "Pago" | "Pendente" | "Atrasado";
  student?: { nome: string }; // Adicionado para facilitar na Dashboard
};

type AppContextData = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  guardians: Guardian[];
  setGuardians: React.Dispatch<React.SetStateAction<Guardian[]>>;
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  installments: Installment[];
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
};

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Buscamos tudo de uma vez, incluindo as mensalidades (installments)
        const [studentsRes, guardiansRes, classesRes, installmentsRes] = await Promise.all([
          axios.get('http://localhost:3333/students'),
          axios.get('http://localhost:3333/guardians'),
          axios.get('http://localhost:3333/classes'),
          axios.get('http://localhost:3333/installments')
        ]);

        setStudents(studentsRes.data);
        setGuardians(guardiansRes.data);
        setClasses(classesRes.data);
        setInstallments(installmentsRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do banco:", error);
      }
    }

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ 
      students, setStudents, 
      guardians, setGuardians, 
      classes, setClasses,
      installments, setInstallments 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);