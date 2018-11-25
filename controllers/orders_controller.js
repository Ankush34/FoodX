const Order = require('../models/order')
const mongoose = require('mongoose');

module.exports = {
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