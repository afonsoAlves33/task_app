// Task.js

import React, { useState, useEffect } from "react";
import './styles.css'
import axios from "axios";
import { Link } from 'react-router-dom'; 


const TaskForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    sector_name: "",
    priority: "baixa",
    status: "a_fazer",
    user_id: "",
  });

  // Carrega a lista de usuários da API quando o componente é montado
  useEffect(() => {
    axios.get("http://localhost:8000/users/")
      .then(response => setUsuarios(response.data))
      .catch(error => console.error("Erro ao carregar usuários:", error));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };


  // Função para enviar os dados do formulário para a API
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData)
    axios.post("http://localhost:8000/tasks", formData)
      .then(response => {
        alert("Tarefa cadastrada com sucesso!");
        setFormData({
          description: "",
          sector_name: "",
          priority: "baixa",
          status: "a_fazer",
          user_id: ""
        });
      })
      .catch(error => console.error("Erro ao cadastrar tarefa:", error));
  };

  return (
    <div>
        <header 
    className='header' 
    style={{
        backgroundColor: '#4a90e2', 
        color: '#fff', 
        padding: '20px 40px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}
>
    <h1 style={{ fontSize: '2.5rem' }}>Gerenciamento de Tarefas</h1>
    <nav className="nav">
        <Link className="Link" to="/cadastro-usuarios" style={{ margin: '10px', textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>Cadastro de Usuários</Link>
        <Link className="Link" to="/cadastrar-tarefas" style={{ margin: '10px', textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>Cadastro de Tarefas</Link>
        <Link className="Link" to="/gerenciar-tarefas" style={{ margin: '10px', textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>Gerenciar Tarefas</Link>
    </nav>
</header>


      <h2>Cadastrar Nova Tarefa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <select name="user_id" value={formData.user_id} onChange={handleChange} required>
          <option value="">Selecione um usuário</option>
          {usuarios.map(user => (
            <option key={user.user_id} value={user.user_id}>{user.username}</option>
          ))}
        </select>

        </div>
        <div>
          <label>Descrição da Tarefa:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
        <label>Setor:</label>
        <input 
          type="text" 
          name="sector_name" 
          value={formData.sector_name} 
          onChange={handleChange} 
          required 
        />
      </div>
        <div>
          <label>Prioridade:</label>
          <select name="priority" value={formData.priority} onChange={handleChange} required>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="a_fazer">A Fazer</option>
            <option value="fazendo">Fazendo</option>
            <option value="pronto">Pronto</option>
          </select>
        </div>
        <button type="submit">Cadastrar Tarefa</button>
      </form>

    </div>
  );
};

export default TaskForm;
