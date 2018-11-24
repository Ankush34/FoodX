import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client'
import KitchenItemComponent from './views/kitchen_display_item_compoent'

export default class MainComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            endpoint: "http://localhost:3000",
            items: []
        }
        const socket = socketIOClient(this.state.endpoint)
        socket.on('order_created', (data) => {
          console.log("data received");
          console.log(data)
          const order = {"item_name": data.name, "item_count": data.count}
          var items = this.state.items
          items.push(order)
          console.log(items.count)
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
                                    <KitchenItemComponent name = {element.item_name} count={element.item_count}/>
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
