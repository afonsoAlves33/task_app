import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './styles.css';

const GerenciamentoDeTarefas = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [usuariosMap, setUsuariosMap] = useState({});
    const [statusOptions] = useState([
        { value: 'a_fazer', label: 'A Fazer' },
        { value: 'fazendo', label: 'Fazendo' },
        { value: 'pronto', label: 'Pronto' }
    ]);

    // Função para buscar os usuários e criar o mapa
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/users');
            setUsuarios(response.data);

            // Criar um dicionário com user_id como chave
            const map = {};
            response.data.forEach(user => {
                map[user.user_id] = user.username;
            });
            setUsuariosMap(map);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    // Função para buscar as tarefas
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar as tarefas:", error);
        }
    };

    // Chama as funções quando o componente é montado
    useEffect(() => {
        fetchUsuarios();
        fetchTasks();
    }, []);

    // Função para atualizar o status da tarefa
    const handleStatusChange = async (taskId, newStatus) => {
        console.log("ID da Tarefa:", taskId);
        console.log("Novo Status:", newStatus);

        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (!taskToUpdate) {
            console.error("Tarefa não encontrada!");
            return;
        }

        try {
            const updatedTask = { ...taskToUpdate, status: newStatus };

            console.log(toString(updatedTask))
            
            await axios.put(`http://127.0.0.1:8000/tasks/${taskId}/`, updatedTask);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? updatedTask : task
                )
            );

            alert("Status da tarefa atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o status da tarefa:", error);
            alert("Erro ao atualizar o status. Verifique os dados e tente novamente.");
        }
    };

    // Função para excluir a tarefa
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}/`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            alert("Tarefa excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir a tarefa:", error);
            alert("Erro ao excluir a tarefa. Tente novamente.");
        }
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


            <div style={styles.gridContainer}>
                {tasks.map((task) => (
                    <div key={task.id} style={styles.taskCard}>
                        <p><strong>Task ID:</strong> {task.id}</p>
                        <p><strong>Usuário:</strong> {usuariosMap[task.user_id] || "Não encontrado"}</p>
                        <p><strong>Descrição:</strong> {task.description}</p>
                        <p><strong>Setor:</strong> {task.sector_name}</p>
                        <p><strong>Prioridade:</strong> {task.priority}</p>
                        <p><strong>Data de Cadastro:</strong> {new Date(task.creation_time_stamp).toLocaleDateString()}</p>
                        <button
                            onClick={() => navigate(`/editar-tarefa/${task.id}`)}
                            style={styles.updateButton}
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={styles.deleteButton}
                        >
                            Excluir
                        </button>
                        <div style={styles.statusContainer}>
                            <label><strong>Status:</strong></label>
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                style={styles.statusDropdown}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px',
    },
    taskCard: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
    },
    statusDropdown: {
        marginLeft: '10px',
        marginRight: '10px',
    },
    updateButton: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
}

export default GerenciamentoDeTarefas;
