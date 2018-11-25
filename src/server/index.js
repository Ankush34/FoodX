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

app.use('/orders', function (req, res, next) {
  res.sendFile(path.join(__dirname,'../../public/', 'order.html'));
});

app.patch('/order/:order_id', function(req, res, next){
  console.log("req received")
  console.log(req.params.order_id)
  orderController.updateStatusById(req.params.order_id, (result) =>{
    res.status(200).json({"success": "true"})  
  })
});

app.use("/get_orders", function(req,res,next){
  orderController.find((orders) => {
    res.setHeader('Content-Type', 'application/json');
    console.log("printing orders")
    console.log(orders)
    console.log("completed printing")
    res.status(200).json(orders)
  })
});

var port = process.env.PORT || 3000

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {

  socket.on('status_changed', (data) => {
    orderController.findById(data["id"], (record) => {
      data["total_quantity_pending"] = record.total_quantity_pending;
      data["total_quantity_completed"] = record.total_quantity_completed;
      data["current_status"] =  record.current_status;
      io.sockets.emit('status_changed', data)
    })
  })

  socket.on('order_created', (data) => {
    console.log("received event from user")
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    var id = undefined;
    orderController.findByName(data["name"], (docs)=>{
      if(docs.length > 0)
      {
        console.log("we need to update the order")
        orderController.updateCountById(docs[0]._id, data["count"], () => {
          id = docs[0]._id;
          total_completed_count = docs[0].total_quantity_completed
          console.log('order_created: ')
          data["id"] = id;
          data["total_quantity_completed"] = total_completed_count;
          data["status"] = "in progress"
          console.log(data);
          io.sockets.emit('order_created', data)    
        })
      }
      else
      {
        orderController.create(data["name"], data["count"], (order) => {
          console.log("in callback for order creation")
          id = order._id
          total_completed_count = 0
          console.log(id)
          console.log('order_created: ')
          data["id"] = id;
          data["total_quantity_completed"] = total_completed_count;
          data["status"] = "in progress"
          console.log(data);
          io.sockets.emit('order_created', data)  
        })
      }
    })
   
  })

  socket.on('disconnect', () => {
    
  })
})

server.listen(port, () => console.log('Listening on port 3000!'));