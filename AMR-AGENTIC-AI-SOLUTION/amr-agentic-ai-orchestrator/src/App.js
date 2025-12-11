import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [robotState, setRobotState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const tasksPerPage = 5;

  // Fetch all created tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://13.234.15.81:3002/api/task/names');
      const data = await response.json();
      setTasks(data.taskNames || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch robot state
  const fetchRobotState = async () => {
    try {
      const response = await fetch('http://13.234.15.81:3002/api/robot/state');
      const data = await response.json();
      setRobotState(data);
    } catch (error) {
      console.error('Error fetching robot state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchRobotState();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(() => {
      fetchTasks();
      fetchRobotState();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Categorize tasks based on robot state
  const getTasksByStatus = () => {
    const inProgress = [];
    const completed = [];
    const created = [];

    if (robotState?.payload?.sequence_status === 'in_progress' || 
        robotState?.payload?.sequence_status === 'in progress') {
      inProgress.push({
        name: robotState.payload.taskName,
        instanceId: robotState.payload.taskInstanceId,
        status: robotState.payload.sequence_status
      });
    } else if (robotState?.payload?.sequence_status === 'completed') {
      completed.push({
        name: robotState.payload.taskName,
        instanceId: robotState.payload.taskInstanceId,
        status: robotState.payload.sequence_status
      });
    }

    // Add other tasks to created list
    if (Array.isArray(tasks)) {
      tasks.forEach(task => {
        if (task !== robotState?.payload?.taskName) {
          created.push({ name: task });
        }
      });
    }

    return { inProgress, completed, created };
  };

  const { inProgress, completed, created } = getTasksByStatus();

  // Filter created tasks based on search
  const filteredCreatedTasks = created.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredCreatedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredCreatedTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="app-container">
      {/* Left Panel */}
      <div className="left-panel">
        {/* Header */}
        <div className="header">
          <h1>AMR Agentic AI Orchestrator</h1>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Map Area */}
          <div className="map-area">
            {/* <h3>Map Area (overlaid vehicle markers)</h3> */}
            <h3>Map</h3>
            
            {/* Video/Map Container */}
            <div className="map-container">
              {inProgress.length > 0 ? (
                <video 
                  key={inProgress[0]?.instanceId}
                  autoPlay 
                  loop 
                  muted 
                  className="map-video"
                  onLoadedMetadata={(e) => e.target.play()}
                >
                  <source src="/hackathon.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src="/map.png" alt="Map" className="map-image" />
              )}
              
              {/* Live Indicator */}
              {inProgress.length > 0 && (
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  <span className="live-text">LIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* Status and Control Options */}
          <div className="status-control">
            {/* <h3>Status and Control Options</h3> */}
            <h3>Vehicle Status</h3>
            {robotState?.payload && (
              <div className="status-info">
                <div className="status-item">
                  <span className="label">Battery:</span>
                  <span className={`value ${robotState.payload.battery_soc < 30 ? 'critical' : 'normal'}`}>
                    {robotState.payload.battery_soc}%
                  </span>
                </div>
                <div className="status-item">
                  <span className="label">Localization:</span>
                  <span className={`value ${!robotState.payload.localization_status ? 'critical' : 'active'}`}>
                    {!robotState.payload.localization_status ? 'Lost' : 'Active'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="label">Emergency:</span>
                  <span className={`value ${robotState.payload.emg_status ? 'emergency' : 'active'}`}>
                    {robotState.payload.emg_status ? 'ACTIVE' : 'Normal'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="label">Cart Status:</span>
                  <span className="value">{robotState.payload.cart_status === 1 ? 'Auto Mode' : 'Manual'}</span>
                </div>
                <div className="status-item">
                  <span className="label">Obstacle:</span>
                  <span className={`value ${robotState.payload.brake_status && robotState.payload.brake_status.includes('VLP_OBS') ? 'active' : 'active'}`}>
                    {robotState.payload.brake_status && robotState.payload.brake_status.includes('VLP_OBS') ? 'None' : 'None'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Lists */}
        <div className="task-section">
          <div className="task-list">
            <h3>
              <span className="status-icon">⚡</span>
              In Progress Tasks
              {inProgress.length > 0 && <span className="task-count active">{inProgress.length}</span>}
            </h3>
            <div className="task-items">
              {loading ? (
                <p className="loading">Loading...</p>
              ) : inProgress.length > 0 ? (
                inProgress.map((task, index) => (
                  <div key={index} className="task-item in-progress">
                    <span className="task-name">{task.name}</span>
                    <div className="task-actions">
                      <button className="action-btn pause" title="Pause Task">
                        ⏸
                      </button>
                      <button className="action-btn cancel" title="Cancel Task">
                        ✕
                      </button>
                      <span className="task-status">{task.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty">No tasks in progress</p>
              )}
            </div>
          </div>

          <div className="task-list">
            <h3>
              Created Tasks
              <span className="task-count">{filteredCreatedTasks.length}</span>
            </h3>
            
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="task-items">
              {loading ? (
                <p className="loading">Loading...</p>
              ) : currentTasks.length > 0 ? (
                currentTasks.map((task, index) => (
                  <div key={index} className="task-item created">
                    <span className="task-name">{task.name}</span>
                    <div className="task-actions">
                      <button className="action-btn execute" title="Execute Task">
                        ▶
                      </button>
                      <button className="action-btn view" title="View Task">
                        👁
                      </button>
                      <button className="action-btn delete" title="Delete Task">
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              ) : searchTerm ? (
                <p className="empty">No tasks match your search</p>
              ) : (
                <p className="empty">No created tasks</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="task-list">
            <h3>
              <span className="status-icon">✓</span>
              Completed Tasks
              {completed.length > 0 && <span className="task-count completed">{completed.length}</span>}
            </h3>
            <div className="task-items">
              {loading ? (
                <p className="loading">Loading...</p>
              ) : completed.length > 0 ? (
                completed.map((task, index) => (
                  <div key={index} className="task-item completed">
                    <span className="task-name">{task.name}</span>
                    <span className="task-status">{task.status}</span>
                  </div>
                ))
              ) : (
                <p className="empty">No completed tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Chatbot */}
      <div className="right-panel">
        <div id="wxo-chat-root"></div>
      </div>
    </div>
  );
}

export default App;