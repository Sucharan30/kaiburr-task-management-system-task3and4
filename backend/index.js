const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { exec } = require('child_process');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// prefer IPv4 loopback to avoid potential IPv6 ::1 connection issues on some setups
const connector = require('./mongo-connector');
connector.connect().catch(err => {
  console.error('Fatal MongoDB connection error:', err);
  process.exit(1);
});

const TaskExecutionSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  output: String
}, { _id: false });

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  owner: String,
  command: String,
  taskExecutions: [TaskExecutionSchema]
});

const Task = mongoose.model('Task', TaskSchema);

// Safety: allow only simple commands (alphanumeric, spaces, dot, dash, slash, underscore)
const SAFE_COMMAND_REGEX = /^[a-zA-Z0-9\s._\/-]*$/;

app.get('/api/tasks', async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const task = await Task.findOne({ id });
      if (!task) return res.status(404).send({ message: 'Not found' });
      return res.json(task);
    }
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.put('/api/tasks', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.id || !payload.command) {
    return res.status(400).send({ message: 'Missing fields' });
  }
  if (!SAFE_COMMAND_REGEX.test(payload.command)) {
    return res.status(400).send({ message: 'Unsafe command' });
  }

  try {
    const task = await Task.findOneAndUpdate({ id: payload.id }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json(task);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.deleteOne({ id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get('/api/tasks/search', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).send({ message: 'Missing name param' });
  try {
    const tasks = await Task.find({ name: { $regex: name, $options: 'i' } });
    if (!tasks.length) return res.status(404).send({ message: 'Not found' });
    res.json(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.put('/api/tasks/:id/execute', async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    if (!task) return res.status(404).send({ message: 'Not found' });
    if (!SAFE_COMMAND_REGEX.test(task.command)) return res.status(400).send({ message: 'Unsafe command' });

    const execStart = new Date();
    exec(task.command, { shell: true }, async (error, stdout, stderr) => {
      const execEnd = new Date();
      const output = stdout + (stderr ? '\n' + stderr : '');
      const execution = { startTime: execStart, endTime: execEnd, output };
      task.taskExecutions.push(execution);
      await task.save();
      if (error) {
        return res.status(400).json({ ...execution, error: error.message });
      }
      res.json(execution);
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Server listening on port', port));
