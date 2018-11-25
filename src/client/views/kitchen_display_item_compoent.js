import React from 'react'
import Axios from 'axios'
import socketIOClient from 'socket.io-client'

export default class KitchenItemComponent extends React.Component
{
  constructor(props)
  {
      super(props);
      this.state = {
        endpoint: "http://localhost:3000",
        total_items: this.props.total_items_completed, 
        id: this.props.id,
        current_order_status: this.props.status,
        current_order_count: this.props.count
                  }
  }
  shouldComponentUpdate(props)
  {   
      if(this.state.current_order_count === props.count)
      {
          return false
      }
      else
      {
        this.setState({...this.state, 
          current_order_count: props.count, 
          current_order_status: props.status,
          total_items: props.total_items_completed})
        console.log("asking component to update")
        return true
      }
  }

  statusChanged = () => {
    console.log("sending the event to the server")
    const socket = socketIOClient(this.state.endpoint)
    socket.emit('status_changed', {"name": this.props.name, "id": this.props.id}) 
    socket.close
  }

  updateToComplete = (id) =>{
    console.log("update product called")
    Axios.patch(`http://localhost:3000/order/${id}`,{headers: {"Content-Type": "application/json"}}).then(res => { 
      console.log(res.status);
      if(res.status === 200)
      {
        this.statusChanged()
      }
    });
  }
  render(){
    return(
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <p>{this.props.name}</p>
            </div>
            <div className="col-md-3">
              <p>{this.state.current_order_count}</p>
            </div>
            <div className="col-md-3">
              <p onClick={(event) => {
                  this.updateToComplete(this.state.id)}
                } 
                className="btn btn-primary">{this.state.current_order_status}
              </p>
            </div>
            <div className="col-md-3">
              <p>{this.state.total_items}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
