import { useEffect, useState } from "react";
import api from './api';

function App(){
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const todaysDate = new Date().toISOString().split('T')[0];

  const priorityWeight: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1
  };

  const sortedTasks = [...tasks].sort((a,b) => {
    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;
    
    if (weightB !== weightA) {
      return weightB - weightA;
    }

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  })

  const loadTasks = async() => {
    try{
      const response = await api.get('/tasks');
      if(response.data.success){
        setTasks(response.data.data);
      }
    } catch(error) {
      console.error('Hiba történt: ', error);
    }
  }

  const loadCategories = async() => {
    try{ 
      const res = await api.get('/categories');
      if(res.data.success){
        setCategories(res.data.data)
      }
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
      await api.post('/tasks', {title: taskTitle, categoryId: Number(selectedCategory), dueDate: dueDate, priority: priority});
      loadTasks();
      setTaskTitle('');
      setSelectedCategory('');
      setDueDate('');
      setPriority('');
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
        t.id === res.data.data.id ? res.data.data : t
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
        <input 
          type="date" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
      </form>
      <button onClick={addTask}>Új feladat hozzáadása</button>
      {sortedTasks.length === 0 ? (
        <p>Nincsenek feladatok...</p>
      ): (
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {sortedTasks.map((t) => (
          <li key={t.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '10px',
            background: '#333',
            padding: '10px',
            borderRadius: '8px'
          }}>
      <input 
        type="checkbox"
        checked={t.isCompleted}
        onChange={() => toggleTask(t.id)}
      />
      
      <span style={{ 
        flex: 1,
        textDecoration: t.isCompleted ? 'line-through' : 'none',
        color: t.isCompleted ? '#888' : '#fff' 
      }}>
        {t.title}
        {t.category ? (
          <b style={{ color: '#007bff', marginLeft: '8px' }}>
            ({t.category.name})
          </b>
        ) : (
          <i style={{ color: '#666', marginLeft: '8px' }}>(Nincs kategória)</i>
        )}
        {t.dueDate ? (
          <b style={{ color : t.dueDate.split('T')[0] < todaysDate && !t.isCompleted ? 'red' : 'inherit'}}>({t.dueDate.split('T')[0]})</b>
        ) : (
          <b>Nincs megadva dátum</b>
        )}

        {t.priority && (
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '12px',
            marginLeft: '10px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            backgroundColor: 
              t.priority === 'high' ? '#ff4444' : 
              t.priority === 'medium' ? '#ffbb33' : 
              '#00c851', 
            color: 'white'
          }}>
            {t.priority}
          </span>
)}
      </span>

      <button 
        onClick={() => deleteTask(t.id)}
        style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
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