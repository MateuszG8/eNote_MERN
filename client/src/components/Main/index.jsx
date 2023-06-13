// Importowanie potrzebnych modułów i komponentów
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../normalize.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar, NavbarBrand, Nav, Button } from 'reactstrap';
import "../../main.css";
import { Link } from 'react-router-dom';
import { faAlignCenter, faCheckCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function Main(args) {
  // Inicjalizacja stanów
  const [task, setTask] = useState(''); // Stan dla nowego zadania
  const [alert, setAlert] = useState(''); // Stan dla alertów
  const [tasks, setTasks] = useState([]); // Stan dla listy zadań
  const [loading, setLoading] = useState(false); // Stan dla kontrolowania stanu ładowania

  // Funkcja obsługująca wylogowanie
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  
  // Funkcja wyświetlająca listę zadań
  const showTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get('http://localhost:8080/api/tasks', { headers });
      setTasks(response.data.tasks);
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja usuwająca zadanie
  const deleteTask = async id => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`
      };
      await axios.delete(`http://localhost:8080/api/tasks/${id}`,{headers});
      await showTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja obsługująca zmianę w inpucie dla nowego zadania
  const handleInputChange = e => {
    setTask(e.target.value);
  };

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`
      };
      await axios.post('http://localhost:8080/api/tasks', { name: task }, { headers });
      await showTasks();
      setAlert('success, task added');
      setTask('');
    } catch (error) {
      setAlert('error, please try again');
    } finally {
      setTimeout(() => {
        setAlert('');
      }, 3000);
    }
  };

  // Funkcja obsługująca działania po montażu komponentu
  useEffect(() => {
    showTasks();
  }, []);

  // Renderowanie komponentu
  return (
      <div>
        <div>
        <Navbar style={{ backgroundColor: "#606c38" }} expand="xl"> 
          <NavbarBrand href="/" ><img
            alt="logo"
            src="/eNote.svg"
            style={{
              height: 80,
              width: 120
            }}
          /></NavbarBrand>
            <Nav className="me-auto" style={{ fontSize: 25, fontWeight:200, }} navbar tabs fill card >
            </Nav>
            <Button color="light" outline size="lg" onClick={handleLogout}>Wyloguj</Button>
        </Navbar>
        </div>
        <div className="container">
        <form className="task-form" onSubmit={handleSubmit}>
          <h4>E-Note</h4>
          <div className="form-control"  style={{display: "flex", alignItems: "center",}}>
            <input
              type="text"
              name="name"
              className="task-input"
              placeholder="np. zrobić projekt..."
              value={task}
              onChange={handleInputChange}
            />
            <button type="submit" style={{backgroundColor: "green", color: "white"}} className="btn submit-btn">
              submit
            </button>
          </div>
          <div className="form-alert">{alert}</div>
        </form>
        <section className="tasks-container" >
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : tasks.length > 0 ? (
            tasks.map(task => (
              <div
                key={task._id}
                className={`single-task ${task.completed ? 'task-completed' : ''}`}
                style={{marginBottom: 14}}
              >
                <h5>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </span>
                  {task.name}
                </h5>
                <div className="task-links">
                  <Link to={`/task/${task._id}`} className="edit-link">
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h5 className="empty-list">No tasks in your list</h5>
          )}
        </section>
        </div>
      </div>
  );
};

export default Main; // Eksportowanie komponentu Main
