const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = 3000;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const userRouter = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// statically serve everything in the build folder on the route '/build'
app.use('/build', express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Websockets
io.on('connection', (socket) => {
  // This is how clients join rooms
  socket.on('room', (user) => socket.join(user));
  // Routes only work after handshake
  app.use('/users',
    // Pass socket param into routers through req param
    (req, res, next) => {
      req.socket = socket;
      return next();
    },
    userRouter);
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

http.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
