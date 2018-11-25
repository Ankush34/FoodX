import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client'
import KitchenItemComponent from './views/kitchen_display_item_compoent'
import Axios from 'axios'
import { CSVLink, CSVDownload } from "react-csv";
 
export default class MainComponent extends React.Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      endpoint: "http://localhost:3000",
      items: []
    }
  }

  componentDidMount(){
    Axios.get(`http://localhost:3000/orders`,{ headers: {"Content-Type": "application/json"}}).then(res => {
      console.log(res.data);
      this.setState({...this.state, items: res.data.map(element => { return({
      "id": element._id, 
      "item_name": element.name, 
      "item_count": element.total_quantity_pending, 
      "item_completed": element.total_quantity_completed,
      "status": element.current_status,
      "total_quantity_expected": element.total_quantity_expected
      })})});
    });

    const socket = socketIOClient(this.state.endpoint)
    
    socket.on('expected_quantity_changed', (data) => {
      console.log("event came for updating expected count");
      console.log(data)
      var items = this.state.items;
      items.map(element => {
        if(data["name"] === element.item_name)
        {
          element["total_quantity_expected"] = data["count"]
          return(element)
        }
        else
        {
          return element
        }
      })
      
      console.log("setting state...")
      this.setState({...this.state, "items": items})
    })

    socket.on('status_changed', (data) => {
      console.log("data received on status change");
      console.log(data);
      var items = this.state.items;
      items.map(element => {
        if(data["id"] === element.id)
        {
          element["item_count"] = data["total_quantity_pending"];
          element["item_completed"] = data["total_quantity_completed"];
          element["status"] = data["current_status"];
          console.log(items)
          return(element);
        }
        else
        {
          return element;
        }
      })

      console.log("setting state...")
      this.setState({...this.state, "items": items})
    })
      
    socket.on('order_created', (data) => {
      console.log("data received");
      console.log(data)
      const order = {
        "id": data.id, 
        "item_name": data.name, 
        "item_count": data.count, 
        "item_completed": data.total_quantity_completed,
        "status": data.status}
      var items = this.state.items
      var flag = false;
      items.map(element => {
        if(element.item_name === data.name)
        {
          console.log("item found")
          element["item_count"] = parseInt(element["item_count"]) + parseInt(data.count)
          element["item_completed"] = parseInt(data.total_quantity_completed)
          element["status"] = "in progress"
          console.log(element);
          flag = true;
          console.log(items)
          return (element)
        }
        else{
          return(element)
        }
      })
      if(flag === false)
      {
        items.push(order)
      }
      console.log("setting state...")
      this.setState({...this.state, "items": items})
    })
  }
  
  prepare_data = ()=>{
    var data = [];
    data.push(["Dish Name", "Produced Count", "Predicted Count"])
    this.state.items.forEach(element => {
      data.push([element.item_name, element.item_completed, element.total_quantity_expected])
    })
    return data
  }
  render()
    {
      return(
      <div className="card" style={{marginBottom:20, marginLeft: 40, marginTop: 20, marginRight: 40}}>
        <div className="card-header">
          <div className="class-title">
            <p> Orders Generated  </p>
          </div>
        </div>
        <div className="card-body">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <p className="text-primary">Dish Name</p>
              </div>
              <div className="col-md-2">
                <p className="text-primary">In Progress</p>
              </div>
              <div className="col-md-2">
                <p className="text-primary">Current Status</p>
              </div>
              <div className="col-md-2">
                <p className="text-primary">Total Completed Orders</p>
              </div>
              <div className="col-md-3">
                <p className="text-primary">Total Orders Expected</p>
              </div>
            </div>
          </div>
          <br/>
          {
            this.state.items.map(element => {
              if(element.item_count !== 0 || element.item_completed !== 0)
              {
                return(
                  <div>
                    <KitchenItemComponent 
                    id={element.id}
                    name = {element.item_name} 
                    count={element.item_count} 
                    total_items_completed={element.item_completed}
                    status={element.status}
                    total_quantity_expected={element.total_quantity_expected}/>
                  </div>
                )
              }
            })
          }
        </div>
        <div className="card-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <CSVLink filename={"products_inventory_details.csv"} className={"btn btn-danger"} data={this.prepare_data()} target="_blank">Export Data</CSVLink>
              </div>
            </div>
          </div>
        </div>
        </div>
      );
    }    
}
ReactDOM.render(<MainComponent />, document.getElementById('root'));
