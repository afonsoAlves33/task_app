import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';
import { Link } from 'react-router-dom';


const EditTaskByUser = () => {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuários
  const [tasks, setTasks] = useState([]); // Lista de tarefas do usuário selecionado
  const [selectedUserId, setSelectedUserId] = useState(""); // Usuário selecionado
  const [selectedTaskId, setSelectedTaskId] = useState(""); // Tarefa selecionada
  const [formData, setFormData] = useState({
    description: "",
    sector_name: "",
    priority: "baixa",
    status: "a_fazer",
    user_id: 0,
  }); // Dados do formulário
  const [loadingTasks, setLoadingTasks] = useState(false); // Controle de carregamento das tarefas

  // Carrega os usuários ao montar o componente
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users")
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Erro ao carregar usuários:", error));
  }, []);

  // Atualiza as tarefas do usuário selecionado
  const handleUserChange = (e) => {
    const userId = e.target.value; // Captura diretamente o user_id
    setSelectedUserId(userId); // Atualiza o estado com o user_id
    setTasks([]); // Reseta as tarefas anteriores
    setSelectedTaskId(""); // Reseta a tarefa selecionada

    if (userId) {
      setLoadingTasks(true);
      axios
        .get(`http://127.0.0.1:8000/tasks/${userId}`) // Usa o user_id diretamente
        .then((response) => setTasks(response.data)) // Atualiza a lista de tarefas
        .catch((error) => console.error("Erro ao carregar tarefas:", error))
        .finally(() => setLoadingTasks(false));
    }
  };

  // Atualiza o formulário com os dados da tarefa selecionada
  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    if (taskId) {
      const task = tasks.find((t) => t.id === parseInt(taskId));
      if (task) {
        setFormData({
          description: task.description || "",
          sector_name: task.sector_name || "",
          priority: task.priority || "baixa",
          status: task.status || "a_fazer",
          user_id: task.user_id || 0, // Adiciona o campo user_id
        });
      }
    } else {
      setFormData({
        description: "",
        sector_name: "",
        priority: "baixa",
        status: "a_fazer",
        user_id: parseInt(selectedUserId) || 0, // Define o user_id como o selecionado
      });
    }
  };

  function removeStatusPrefix(data) {
    if (typeof data === 'string') {
        return data.replace(/^Status\.\s*/, ''); // Remove "Status." do início da string
    }
    return data; // Retorna o dado original se não for string
  }

  // Lida com mudanças no formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envia os dados atualizados da tarefa
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      alert("Selecione uma tarefa para atualizar.");
      return;
    }
    
    formData.status = removeStatusPrefix(formData.status)

    console.log("FormData: ",formData)

    axios
      .put(`http://127.0.0.1:8000/tasks/${selectedTaskId}/`, formData)
      .then(() => {
        alert("Tarefa atualizada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar tarefa:", error);
        alert("Erro ao atualizar tarefa. Tente novamente.");
      });
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

      <h1>Editar Tarefa por Usuário</h1>

      {/* Seleção de Usuário */}
      <div>
        <label>Usuário:</label>
        <select value={selectedUserId} onChange={handleUserChange}>
          <option value="">Selecione um usuário</option>
          {usuarios.map((usuario) => (
            <option key={usuario.user_id} value={usuario.user_id}>
              {usuario.username}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de Tarefa */}
      {selectedUserId && (
        <div>
          <label>Tarefa:</label>
          <select value={selectedTaskId} onChange={handleTaskChange} disabled={loadingTasks}>
            <option value="">Selecione uma tarefa</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Formulário de Edição */}
      {selectedTaskId && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Descrição:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Setor:</label>
            <input
              type="text"
              name="sector_name"
              value={formData.sector_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Prioridade:</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleFormChange}
              required
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              required
            >
              <option value="a_fazer">A Fazer</option>
              <option value="fazendo">fazendo</option>
              <option value="pronto">pronto</option>
            </select>
          </div>
          <button type="submit">Salvar Alterações</button>
        </form>
      )}
    </div>
  );
};

export default EditTaskByUser;
