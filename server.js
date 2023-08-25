const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

let tasks = [
  { id: '1', name: "Shopping" },
  { id: '2', name: "Reading" }
];
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id: ' + socket.id);
  client = socket.id;
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskID) => {
    tasks = tasks.filter(task => task.id !== taskID);
    socket.broadcast.emit('removeTask', taskID);
  });
});

