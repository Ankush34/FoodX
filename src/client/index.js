import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderItem from './views/order_item_view_component'

export default class MainComponent extends React.Component
{    
    render()
    {
        const menu_categories = {
        "Chinese Starters": ["Hakka Noodles", "Mushroom Hakka Noodles", "Paneer 65", "Paneer Munchurion", "Mushroom Munchurion", "Veg Munchurion"], 
        "Punjabi Starters": ["Paneer Tikka ", "Paneer Garlic Tikka", "Mushroom Tikka", "Mushroom Garlic Tikka", "Paneer Angara Tikka", "Mushroom Angara Tikka", "Paneer Chilli", "Mushroom Chilli", "Babycorn Tikka", "Babycorn Chilli"], 
        "Mexican Starters": ["Alfredo Pasta", "Penne Pasta", "Veg Taco", "Paneer Masala Taco", "Cheese Garlic Taco", "Capcicum Chilli Taco", "Capco Pasta"], 
        "Punjabi Main Course": ["Paneer Chilli", "Paneer Tikka", "Paneer Butter Masala", "Mushroom Tikka Masala", "Mushroom Fry", "Paneer Fry", "Veg kadhai"], 
        "Indian Breads": ["Roti", "Chapati", "Punjabi Paratha", "Butter Naan", "Punjabi fulka", "Chapati", "Butter Paratha"]}
        const keys = Object.keys(menu_categories)
        console.log(keys)
        return(
            <div>
                {
                    keys.map(element => {
                        return(
                            <div className="card" style={{marginTop: 40, marginLeft: 40, marginTop: 20, marginRight: 40}}>
                                <div className="card-header">
                                    <div className="card-title">
                                        <p>{element}</p>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="container">
                                        { menu_categories[element].map(element => {
                                            return(
                                                <OrderItem name={element}></OrderItem>
                                            )
                                        }) }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }    
}
ReactDOM.render(<MainComponent />, document.getElementById('root'));
