const Order = require('../models/order')
const mongoose = require('mongoose');

// this controller is responsible for creation deletion updation and read of the orders from the system
// this contains methods that are required to manipulate data on views

module.exports = {
// find method is responsible for getting all the data records from the system

    find: function(callback){
        Order.find()
        .then(docs => {
            console.log(docs)
            callback(docs)
        })
        .catch(err => {
            console.log(err)
        })
    },

// this findById method is responsible in order to get the doc out of the database based upon the id passed
// as parameter, this helps to keep our routes clean since that code could also be placed there
    findById: function(params_id, callback){
        Order.findById(params_id).then(doc => {
            console.log("doc received for status change");
            console.log(doc)
            if(doc !== undefined)
            {
                callback(doc)
            }
            else
            {
                console.log("data not found")
            }
        })
    },

// this method is responsible for updating the status of the order based upon the action taken 
// on the view , this method finds the doc and then updates its status along with the necessary attributes
// that are required to get updated with the status 
    updateStatusById: function(params_id, callback){
        Order.findById(params_id).then(doc => {
            console.log("doc received for update");
            console.log(doc);
            const count_pending = parseInt(doc.total_quantity_pending);
            var count_completed = parseInt(doc.total_quantity_completed)
            count_completed = parseInt(count_completed) + parseInt(count_pending);
            Order.update({_id: params_id}, {$set: {total_quantity_pending: 0, total_quantity_completed: count_completed, current_status: "Done"}})
            .exec()
            .then(result => {
                console.log("updated status result")
                console.log(result);
                callback(result)
            })
            .catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err)
        })
    },
    
// this method comes in use when we keep on taking orders on the dashboard and we need to update
// the count of items on the collection record , this gets the id of the record to be updated and the value
// how much is required to updated
    updateCountById: function(params_id, params_value, callback){
        Order.findById(params_id).then(doc => {
            console.log("doc received for update")
            console.log(doc)
            const id = doc._id
            const count = doc.total_quantity_pending;
            const total_count = parseInt(count) + parseInt(params_value);
            Order.update({_id: id},{$set: {current_status: "in progress", total_quantity_pending: total_count}})
            .exec()
            .then(result => {
                console.log(result)
                callback()
            })
            .catch(err => {console.log(err)})
        }).catch(err => {
            console.log(err)
        })
    },

// this method is responsible for getting record by name ,  since we map the names of dishes on the dashboard 
// to the database , we check if that particular dish has been taken to the database in kitchens record
// since we do not have any id associated with the record before it has been created in database we need to map using name
    findByName: function(nameField, callback){
        Order.find({name: nameField}).then(docs => {
            if(docs.length > 0)
            {
                console.log("found by name")
                console.log(docs)    
            }
            else{
                console.log("not found anything such")
                console.log(docs)
            }
            callback(docs)
        })
        .catch(err => {
            console.log(err)
        })
    },
// this method is used in order to create a new order when the item is added first time to the kitchen 
// menu for prepration, here after when ever same dish comes for making this action is not invoked
// just the update count method is called
    create: function(item_name, count,callback){
        const order = Order.create({
            _id: new mongoose.Types.ObjectId(),
            name: item_name,
            total_quantity_completed: 0,
            total_quantity_pending: count,
            current_status: 'in progress'
        })
        .then(result => {
            console.log("order created successfully")
            console.log(result)
            callback(result)
        })
        .catch((error) => {
            console.log(error)
            done();
          });
    }
}