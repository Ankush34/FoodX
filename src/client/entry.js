import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client'
import KitchenItemComponent from './views/kitchen_display_item_compoent'
import Axios from 'axios'

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
        Axios.get(`http://localhost:3000/get_orders`,{headers: {"Content-Type": "application/json"}}).then(res => {
            console.log(res.data);
            this.setState({...this.state, items: res.data.map(element => { return({
            "id": element._id, 
            "item_name": element.name, 
            "item_count": element.total_quantity_pending, 
            "item_completed": element.total_quantity_completed,
            "status": element.current_status
            })})});
        });

        const socket = socketIOClient(this.state.endpoint)
        
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

    render()
    {
        return(
            <div className="card" style={{marginTop: 40, marginLeft: 40, marginTop: 20, marginRight: 40}}>
                <div className="card-header">
                    <div className="class-title">
                        <p> Orders Created </p>
                    </div>
                </div>
                <div className="card-body">
                    {
                        this.state.items.map(element => {
                            return(
                                <div>
                                    <KitchenItemComponent 
                                    id={element.id}
                                    name = {element.item_name} 
                                    count={element.item_count} 
                                    total_items_completed={element.item_completed}
                                    status={element.status}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }    
}
ReactDOM.render(<MainComponent />, document.getElementById('root'));
