import React from 'react'

export default class KitchenItemComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { total_items: 0, 
                       current_order_status: 'in progress',
                       current_order_count: this.props.count
                    }
    }

    componentWillReceiveProps(props)
    {
        console.log("receiving props")
    }

    shouldComponentUpdate(props)
    {
        console.log("should component update")
        return false
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
                            <p className="btn btn-primary">{this.state.current_order_status}</p>
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
