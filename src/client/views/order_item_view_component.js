import React from 'react'
import socketIOClient from 'socket.io-client'

export default class OrderItem extends React.Component{
  constructor(props)
  {
      super(props)
      this.state = {
        endpoint: `https://foodx-app.herokuapp.com`,
        item_count_to_order: "",
        // this is where we are connecting to with sockets
      }
  }

  send = () => {
      if(this.state.item_count_to_order !== "")
      {
        console.log("sending the event to the server")
        const socket = socketIOClient(this.state.endpoint)
        socket.emit('order_created', {"name": this.props.name, "count": this.state.item_count_to_order}) 
        socket.close
        this.setState({...this.state, item_count_to_order: ""})    
      }
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
          <div className="col-md-3">
            <p>{ this.props.name }</p>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <input type="number" onChange={(evt)=>this.changeCount(evt)} className="form-control" value={this.state.item_count_to_order} placeholder="count to place order .... "/>
            </div>
          </div>
          <div className="col-md-3">
            <p onClick={()=>this.send()} className="btn btn-primary" style={{marginLeft: "100"}}>{ "Place Order" }</p>
          </div>
          <div className="col-md-3">
            <a className={"btn btn-danger"} href={`https://foodx-app.herokuapp.com/edit?name=${this.props.name}`}> Expected Inventory edit </a>
          </div>
        </div>
      </div>
    )
  }
}