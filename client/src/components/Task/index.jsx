// Importowanie potrzebnych modułów i komponentów
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import '../../main.css';
import "../../normalize.css"
import { Navbar, NavbarBrand, Nav, Button } from 'reactstrap';

const Task = () => {
  const { id } = useParams(); // Pobieranie ID zadania z parametrów URL
  const [taskData, setTaskData] = useState({
    name: '',
    completed: false,
  });
  const [alert, setAlert] = useState({
    display: false,
    message: '',
    success: false
  });

  // Funkcja obsługująca wylogowanie
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.assign('/');
  };
  
  // Fetching task data when component mounts
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`
      };
        const response = await axios.get(`http://localhost:8080/api/tasks/${id}`,{headers});
        const task = response.data.task;
        setTaskData({
          name: task.name,
          completed: task.completed
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
  }, [id]);

  // Funkcje do obsługi zmian w formularzu
  const handleNameChange = (e) => {
    setTaskData({
      ...taskData,
      name: e.target.value
    });
  };

  const handleCompletedChange = (e) => {
    setTaskData({
      ...taskData,
      completed: e.target.checked
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.patch(`http://localhost:8080/api/tasks/${id} `, taskData, {headers});
      const task = response.data.task;
      setTaskData({
        name: response.data.name,
        completed: response.data.completed
      });
      setAlert({
        display: true,
        message: 'Success, edited task',
        success: true
      });
    } catch (error) {
      console.error(error);
      setAlert({
        display: true,
        message: 'Error, please try again',
        success: false
      });
    }
    setTimeout(() => {
      setAlert({
        ...alert,
        display: false
      });
    }, 3000);
  };
  
  // Renderowanie komponentu
  return (
    <div>
      <div>
        <Navbar style={{ backgroundColor: "#606c38" }} expand="xl"> 
          <NavbarBrand href="/" >
            <img
              alt="logo"
              src="/eNote.svg"
              style={{
                height: 80,
                width: 120
              }}
            />
          </NavbarBrand>
          <Nav className="me-auto" style={{ fontSize: 25, fontWeight:200 }} navbar tabs fill card >
          </Nav>
          <Button color="light" outline size="lg" onClick={handleLogout}>Logout</Button>
        </Navbar>
      </div>
      <div className="container" style={{direction: "column", alignItems: "center",}}>
        <form className="single-task-form" onSubmit={handleFormSubmit}>
          <h4>Edit Task</h4>
          <div className="form-control">
            <label>Task ID</label>
            <p className="task-edit-id">{id}</p>
          </div>
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" className="task-edit-name" value={taskData.name} onChange={handleNameChange} />
          </div>
          <div className="form-control">
            <label htmlFor="completed">Completed</label>
            <input type="checkbox" name="completed" className="task-edit-completed" checked={taskData.completed} onChange={handleCompletedChange} />
          </div>
          <button type="submit" style={{backgroundColor: "green", color: "white"}} className="block btn task-edit-btn">Edit</button>
          <div className="form-alert">{alert.display && alert.message}</div>
          <Link to="/"><button  className="block btn task-edit-btn" style={{backgroundColor: "#283618", color: "white"}}>Back to tasks</button></Link>
        </form>
      </div>
    </div>
  );
}

export default Task; // Eksportowanie komponentu Task
