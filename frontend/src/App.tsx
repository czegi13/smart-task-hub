import { useEffect, useState } from "react";
import api from './api';

function App(){
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async() => {
      const res = await api.get('/tasks');
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px'}}>
      <h1>Smart-Task-Hub</h1>
      {tasks.length === 0 ? (
        <p>Nincsenek feladatok...</p>
      ): (
        <ul>
          {tasks.map(t => <li key={t.id}>{t.title}</li>)}
        </ul>
      )}
    </div>
  );
}

export default App;