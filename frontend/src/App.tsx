import { useEffect, useState } from "react";
import api from './api';

function App(){
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState('');

  const loadTasks = async() => {
    try{
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch(error) {
      console.error('Hiba történt: ', error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = await api.post('tasks', {title: taskTitle});
    setTasks([...tasks, newTask.data]);

    setTaskTitle('');
  }

  const addTask = async() => {
    if(!taskTitle.trim()) return;

    try{
      const response = await api.post('/tasks', {title: taskTitle});
      setTasks([...tasks, response.data]);
      setTaskTitle('');
    } catch(error){
      console.log('Error while adding task', error);
    }
  }

  const deleteTask = async(id: number) => {
    try{
      await api.delete(`/tasks/${id}`)
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      
    } catch(error){
      console.log('Error while deleting task', error);
    }

  }

  return (
    <div style={{ padding: '20px'}}>
      <h1>Smart-Task-Hub</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder = "Új feladat megadása..."
        />
      </form>
      <button onClick={addTask}>Új feladat hozzáadása</button>
      {tasks.length === 0 ? (
        <p>Nincsenek feladatok...</p>
      ): (
        <ul>
          {tasks.map((t) => (
              <li key={t.id}>
                <span>{t.title}</span> 
                
                <button onClick={() => deleteTask(t.id)}>
                  Törlés
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;