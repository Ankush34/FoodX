const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var webpack = require('webpack');
var path = require('path');
var config = require(path.join(__dirname,'../../webpack.config.js'));
var compiler = webpack(config);
const http = require("http");
const socketIo = require("socket.io");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: '/'
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/public', express.static('public'));

app.use('/dashboard', function (req, res, next) {
res.sendFile(path.join(__dirname,'../../public/', 'dashboard.html'));
});

app.use('/orders', function (req, res, next) {
res.sendFile(path.join(__dirname,'../../public/', 'order.html'));
});

var port = process.env.PORT || 3000

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('User connected')
  
  socket.on('order_created', (data) => {
    console.log("received event from user")
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('order_created: ')
    console.log(data);
    io.sockets.emit('order_created', data)  
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log('Listening on port 3000!'));