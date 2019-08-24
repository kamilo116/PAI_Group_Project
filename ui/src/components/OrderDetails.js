import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addOrder, addOrderDetail} from "../utils/post-api";
import {addToCart, clearAddedItems} from "./actions/cartActions";
import {Link} from "react-router-dom";
import Recipe from "./Recipe";
import {getUser} from "../utils/get-api";
import t_shirt_pol from "../images/pol.jpg";
import t_shirt_arg from "../images/arg.jpg";
import t_shirt_bel from "../images/bel.jpg";
import t_shirt_fr from "../images/fr.jpg";
import default_t_shirt from "../images/default.png";


var tshirts = {
    "Polish": t_shirt_pol,
    "Argentinean": t_shirt_arg,
    "Belgian": t_shirt_bel,
    "French": t_shirt_fr,
    "default": default_t_shirt
};

class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: [],
            user: []
        }
        this.createOrder = this
            .createOrder
            .bind(this)
    }

    componentDidMount() {
        this.setState({order: this.props.order})
    }

    createOrder() {
        let user = this.props.user;
            addOrder(/*this.props.order.userId*/ user[0].id, this.props.order.address).then((order) => {
                this.props.addedItems.map(product => {
                    addOrderDetail(order.id, product.id, product.quantity)
                    this.props.clearAddedItems();
                })
            })
    }

    render() {
        let addressText = '';
        if (this.props.order.personalCollection) {
            addressText = "Personal collection at: " + this.props.order.address
        } else {
            addressText = "Send order to: " + this.props.order.address
        }

        let addedItems = this.props.addedItems.length ?
            (
                this.props.addedItems.map(item => {
                    return (

                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img">
                                <img src={tshirts[item.name]} alt={item.name} className=""/>
                            </div>

                            <div className="item-desc">
                                <span className="title">{item.name}</span>
                                <p>{item.description}</p>
                                <p><b>Price: {item.price}$</b></p>
                                <p>
                                    <b>Quantity: {item.quantity}</b>
                                </p>
                            </div>

                        </li>

                    )
                })
            ) :
            (
                <p>Nothing.</p>
            )
        return (
            <div className="container">
                <div className="cart">
                    <h5>{addressText}</h5>
                    <ul className="collection">
                        {addedItems}
                    </ul>
                </div>

                <div className="container">
                    <div className="collection">
                        <li className="collection-item"><b>Total: {this.props.total} $</b></li>
                    </div>
                    <div className="order">
                        <ul>
                            <li onClick={this.createOrder}><Link to="/">
                                <button className="waves-effect waves-light btn">Order</button>
                            </Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

// connected React component will have access to the exact part of the store it needs
const mapStateToProps = (state) => {
    return {
        addedItems: state.cartReducer.addedItems,
        order: state.cartReducer.order,
        total: state.cartReducer.total,
        user: state.cartReducer.user
    }
}

//mapDispatchToProps connects Redux actions to React props
const mapDispatchToProps = (dispatch) => {
    return {
        addShipping: () => {
            dispatch({type: 'ADD_SHIPPING'})
        },
        substractShipping: () => {
            dispatch({type: 'SUB_SHIPPING'})
        },
        addToCart: (product) => {
            dispatch(addToCart(product))
        },
        clearAddedItems: () => {
            dispatch(clearAddedItems())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
