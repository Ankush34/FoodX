import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom'
import Axios from 'axios'
import socketIOClient from 'socket.io-client'

export default class EditOrder extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      endpoint: "http://localhost:3000",
      name: "",
      count_to_update: 0
    }
  }

  changeCount = (event) =>{
    this.setState({...this.state, "count_to_update": event.target.value})
  }

  componentDidMount()
  {
    var name = unescape(this.getUrlParams("name")); 
    this.setState({...this.state, "name": name})
  }
  getUrlParams = (sParam) =>{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
  }
  updateRecord = (event) => {
    console.log("update record called");
    Axios.post("http://localhost:3000/update",{data: {name: this.state.name, count: this.state.count_to_update}}, {headers: {"Content-type": "application/json"}})
    .then(res => {
      if(res.status === 200)
      {
        console.log("emitting event")
        const socket = socketIOClient(this.state.endpoint)
        socket.emit('expected_quantity_changed', {"name": this.state.name, "count": this.state.count_to_update})
        socket.on('expected_quantity_changed', (data) => {
          window.location.replace("http://localhost:3000/dashboard")
        })
        socket.close
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  render()
  {
    return(
      <div className="container">
        <div className="card" style={{marginLeft: 40, marginRight: 40, marginTop: 20, marginBottom: 20}}>
          <div className="card-header">
            <div className="title">
              Edit Order Item Expected Count
            </div>
          </div>
          <div className="card-body">
            <div className="form">
              <div className="row">
                <div className="col-md-4">
                  <input type="number" onChange={(evt)=>this.changeCount(evt)} className="form-control" value={this.state.count_to_update} placeholder="expected count for orders.... "/>
                </div>
              </div>
              <div className="row" style={{marginTop: 20}}>
                <div className="col-md-4">
                  <p className="btn btn-primary" onClick={(event) => { this.updateRecord(event)}}> Update count </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<EditOrder />, document.getElementById('root'));
