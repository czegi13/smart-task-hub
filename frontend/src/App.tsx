import { useEffect, useState } from "react";
import api from './api';

function App(){
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  const loadTasks = async() => {
    try{
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch(error) {
      console.error('Hiba történt: ', error);
    }
  }

  const loadCategories = async() => {
    try{ 
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch(error){
      console.log('Error while loading categories', error);
    }
  }

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [])




  const addTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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
      await api.delete(`/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      
    } catch(error){
      console.log('Error while deleting task', error);
    }
  }

  const toggleTask = async (id: number) => {
    try{
      const res = await api.patch(`/tasks/${id}`);
      
      const updatedList = tasks.map((t) =>
        t.id === res.data.id ? res.data : t
      );

      setTasks(updatedList);
      

    } catch(error){
      console.log('Error while editing task', error);
    }
  }

  return (
    <div style={{ padding: '20px'}}>
      <h1>Smart-Task-Hub</h1>
      <form onSubmit={addTask}>
        <input 
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder = "Új feladat megadása..."
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">
            Válassz kategóriát...
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </form>
      <button onClick={addTask}>Új feladat hozzáadása</button>
      {tasks.length === 0 ? (
        <p>Nincsenek feladatok...</p>
      ): (
        <ul>
          {tasks.map((t) => (
              <li key={t.id}>
                <span style={{ 
                  textDecoration: t.isCompleted ? 'line-through' : 'none',
                  color: t.isCompleted ? 'gray' : 'black' 
                }}>
                  {t.title}
                </span> 
                
                <button onClick={() => deleteTask(t.id)}>
                  Törlés
                </button>

                <input 
                  type="checkbox"
                  checked={t.isCompleted}
                  onChange={() => toggleTask(t.id)}
                />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;