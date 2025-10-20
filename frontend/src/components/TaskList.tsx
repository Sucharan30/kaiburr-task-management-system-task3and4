import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Snackbar,
} from '@mui/material';
// removed icon imports to avoid missing type declarations; using text labels instead

interface TaskExecution {
  startTime: string;
  endTime: string;
  output: string;
}

interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions: TaskExecution[];
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // removed unused loading state
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({ id: '', name: '', owner: '', command: '' });
  const [executionOutput, setExecutionOutput] = useState('');
  const [executionModalVisible, setExecutionModalVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch tasks' });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = async () => {
    if (!searchText) {
      fetchTasks();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/search?name=${searchText}`);
      setTasks(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to search tasks' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setSnackbar({ open: true, message: 'Task deleted successfully' });
      fetchTasks();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete task' });
    }
  };

  const handleExecute = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${id}/execute`);
      setExecutionOutput(response.data.output || response.data);
      setExecutionModalVisible(true);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to execute task' });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put('http://localhost:8080/api/tasks', formValues);
      setSnackbar({ open: true, message: 'Task created successfully' });
      setIsModalVisible(false);
      setFormValues({ id: '', name: '', owner: '', command: '' });
      fetchTasks();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create task' });
    }
  };

  

  return (
    <div>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search tasks by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
        <Button variant="contained" onClick={() => setIsModalVisible(true)}>Create Task</Button>
      </Box>

      <TableContainer component={Paper}>
        <MuiTable>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Command</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.owner}</TableCell>
                <TableCell>{task.command}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleExecute(task.id)}>
                    Run
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    Delete
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <Dialog open={isModalVisible} onClose={() => setIsModalVisible(false)} fullWidth>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="ID"
              value={formValues.id}
              onChange={(e) => setFormValues({ ...formValues, id: e.target.value })}
              fullWidth
            />
            <TextField
              label="Name"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Owner"
              value={formValues.owner}
              onChange={(e) => setFormValues({ ...formValues, owner: e.target.value })}
              fullWidth
            />
            <TextField
              label="Command"
              value={formValues.command}
              onChange={(e) => setFormValues({ ...formValues, command: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={executionModalVisible} onClose={() => setExecutionModalVisible(false)} fullWidth>
        <DialogTitle>Task Execution Output</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{executionOutput}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecutionModalVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default TaskList;