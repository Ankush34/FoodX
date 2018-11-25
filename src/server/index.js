const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var webpack = require('webpack');
var path = require('path');
var config = require(path.join(__dirname,'../../webpack.config.js'));
var compiler = webpack(config);
const http = require("http");
const socketIo = require("socket.io");
var mongoose = require('mongoose');
const orderController = require('../../controllers/orders_controller')
const socketHelper = require('./socket_helper')

mongoose.connect('mongodb://localhost:27017/foodx',{ useNewUrlParser: true });
let db = mongoose.connection
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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

app.patch('/order/:order_id', function(req, res, next){
  console.log("req received")
  console.log(req.params.order_id)
  orderController.updateStatusById(req.params.order_id, (result) =>{
    res.status(200).json({"success": "true"})  
  })
});

app.use("/orders", function(req,res,next){
  if(req.headers.accept.indexOf('application/json') !== -1)
  {
    orderController.find((orders) => {
      res.setHeader('Content-Type', 'application/json');
      console.log("printing orders")
      console.log(orders)
      console.log("completed printing")
      res.status(200).json(orders)
    })
  }
  else
  {
    res.sendFile(path.join(__dirname,'../../public/', 'order.html'));
  }
 
});

var port = process.env.PORT || 3000

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('status_changed', (data) => {
    socketHelper.status_changed(data, io)
  })
  
  socket.on('order_created', (data) => {
    socketHelper.order_created(data, io)
    })

  socket.on('disconnect', () => {
  })
})

server.listen(port, () => console.log('Listening on port 3000!'));