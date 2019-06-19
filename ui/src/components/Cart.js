import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem,addQuantity,subtractQuantity} from './actions/cartActions'
import Recipe from './Recipe'
import item1 from '../images/honey.jpg'
import {deleteFromBasket} from "../utils/delete-api";

class Cart extends Component{

    //to remove the item completely
    handleRemove = (product)=>{
        this.props.removeItem(product);
        deleteFromBasket(product.id)
    }
    //to add the quantity
    handleAddQuantity = (product)=>{
        this.props.addQuantity(product);
    }
    //to substruct from the quantity
    handleSubtractQuantity = (product)=>{
        this.props.subtractQuantity(product);
    }
    render(){

        let addedItems = this.props.items.length ?
            (
                this.props.items.map(item=>{
                    return(

                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img">
                                <img src={item1} alt={item1} className=""/>
                            </div>

                            <div className="item-desc">
                                <span className="title">{item.name}</span>
                                <p>{item.description}</p>
                                <p><b>Price: {item.price}$</b></p>
                                <p>
                                    <b>Quantity: {item.quantity}</b>
                                </p>
                                <div className="add-remove">
                                    <Link to="/cart"><i className="material-icons" onClick={()=>{this.handleAddQuantity(item)}}>arrow_drop_up</i></Link>
                                    <Link to="/cart"><i className="material-icons" onClick={()=>{this.handleSubtractQuantity(item)}}>arrow_drop_down</i></Link>
                                </div>
                                <button className="waves-effect waves-light btn blue remove" onClick={()=>{this.handleRemove(item)}}>Remove</button>
                            </div>

                        </li>

                    )
                })
            ):

            (
                <p>Nothing.</p>
            )
        return(
            <div className="container">
                <div className="cart">
                    <h5>You have ordered:</h5>
                    <ul className="collection">
                        {addedItems}
                    </ul>
                </div>
                <Recipe />
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
    return{
        items: state.cartReducer.addedItems,
        addedItems: state.cartReducer.addedItems
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
        removeItem: (product)=>{dispatch(removeItem(product))},
        addQuantity: (product)=>{dispatch(addQuantity(product))},
        subtractQuantity: (product)=>{dispatch(subtractQuantity(product))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Cart)