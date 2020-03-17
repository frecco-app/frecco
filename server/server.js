const express = require ('express');
const app = express();
const path = require ('path');
const userRouter = require ('./routes/users');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;


// statically serve everything in the build folder on the route '/build'
app.use('/build', express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});



app.use('/users', userRouter);

app.listen(PORT, () => console.log('Listening on Port ' + PORT));