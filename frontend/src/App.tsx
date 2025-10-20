import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Task Management System</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ paddingTop: 24 }}>
        <TaskList />
      </Container>
    </div>
  );
}

export default App;
