import React from 'react'
import Axios from 'axios'
import socketIOClient from 'socket.io-client'

export default class KitchenItemComponent extends React.Component
{
  constructor(props)
  {
      super(props);
      this.state = {
        endpoint: `https://foodx-app.herokuapp.com:${process.env.PORT || 3000}`,
        total_items: this.props.total_items_completed, 
        id: this.props.id,
        current_order_status: this.props.status,
        current_order_count: this.props.count,
        total_quantity_expected: this.props.total_quantity_expected
                  }
  }
  shouldComponentUpdate(props)
  {   
      if(this.state.current_order_count === props.count && this.state.total_quantity_expected === props.total_quantity_expected)
      {
          return false
      }
      else
      {
        this.setState({...this.state, 
          current_order_count: props.count, 
          current_order_status: props.status,
          total_items: props.total_items_completed,
        total_quantity_expected: props.total_quantity_expected})
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
    Axios.patch(`https://foodx-app.herokuapp.com/order/${id}`,{headers: {"Content-Type": "application/json"}}).then(res => { 
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
            <div className="col-md-2">
              <p>{this.state.current_order_count}</p>
            </div>
            <div className="col-md-2">
              <p onClick={(event) => {
                  this.updateToComplete(this.state.id)}
                } 
                className="btn btn-primary">{this.state.current_order_status}
              </p>
            </div>
            <div className="col-md-2">
              <p>{this.state.total_items}</p>
            </div>
            <div className="col-md-3">
              <p>{this.state.total_quantity_expected}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
