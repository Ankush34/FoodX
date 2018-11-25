const orderController = require('../../controllers/orders_controller')

module.exports = {
// status changed is called when an order is completed and status is changed
// this calls the controller action and updates the status that on update status
// emits the changed event and asks all the screens to update the data
  status_changed: (data, io) => {
    orderController.findById(data["id"], (record) => {
      data["total_quantity_pending"] = record.total_quantity_pending;
      data["total_quantity_completed"] = record.total_quantity_completed;
      data["current_status"] =  record.current_status;
      io.sockets.emit('status_changed', data)
    })

    },
// this method is called by the route in when a order is created that is 
// when  a order is added in the system
    order_created: (data, io) => {
      console.log("received event from user")
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
    },

    expected_quantity_changed: (data, io)=>{
      io.sockets.emit('expected_quantity_changed', data);
    }
}