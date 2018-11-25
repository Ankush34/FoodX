import React from 'react'
import socketIOClient from 'socket.io-client'

export default class OrderItem extends React.Component{
    constructor(props)
    {
        super(props)
        this.state = {
            endpoint: "http://localhost:3000", 
            item_count_to_order: 0,
            // this is where we are connecting to with sockets
        }
    }

    send = () => {
        console.log("sending the event to the server")
        const socket = socketIOClient(this.state.endpoint)
        socket.emit('order_created', {"name": this.props.name, "count": this.state.item_count_to_order}) 
        socket.close
    }

    changeCount = (element) => {
        console.log("changing value"+element.target.value)
        this.setState({...this.state, item_count_to_order: element.target.value})
    }
    render()
    {
        const socket = socketIOClient(this.state.endpoint)
    
        // socket.on is another method that checks for incoming events from the server
        // This method is looking for the event 'change color'
        // socket.on takes a callback function for the first argument
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <p>{ this.props.name }</p>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <input type="text" onChange={(evt)=>this.changeCount(evt)} className="form-control" placeholder="count to place order .... "/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <p onClick={()=>this.send()} className="btn btn-primary" style={{marginLeft: "100"}}>{ "Place Order" }</p>
                    </div>
                </div>
            </div>
        )
    }
}