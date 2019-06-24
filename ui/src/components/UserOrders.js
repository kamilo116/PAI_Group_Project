import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addCategory, addOrder, addOrderDetail} from "../utils/post-api";
import {addToCart, clearAddedItems} from "./actions/cartActions";
import {Link} from "react-router-dom";
import Recipe from "./Recipe";
import {getOrderByUserId, getOrderDetailsByOrderId, getProduct, getUser} from "../utils/get-api";

//import { addShipping } from './actions/cartActions'

class UserOrders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderDetails: [],
            orders: [],
            products: [],
        }
        this.getOrderDetails = this
            .getOrderDetails
            .bind(this)
    }

    componentDidMount() {
        this.getOrderDetails()
    }

    getOrderDetails() {
        let orderDetailsArray = []
        let ordersArray = []
        let productsArray = []
        let user = this.props.user;
        // getUser().then((user) => {
            getOrderByUserId(user[0].id).then((orders) => {
                orders.map(order => {
                    ordersArray.push(order)
                    getOrderDetailsByOrderId(order.id).then((orderDetails) => {
                        orderDetails.map((orderDetail) => {
                            orderDetailsArray.push(orderDetail)
                            debugger
                            getProduct(orderDetail.productId).then(products => {
                                products.map(product => {
                                    console.log("product:" + product);
                                    if(!productsArray.map(product=> product.id).includes(product.id)){
                                        productsArray.push(product)
                                    }
                                });
                                // orderDetailsArray.map(orderDetail => {
                                //     addValueToKey(orderDetail.orderId, orderDetail)
                                // })
                                let newState = {
                                    products: productsArray,
                                    orderDetails: orderDetailsArray,
                                    orders: ordersArray
                                };
                                this.setState(newState);
                                // orderDetailsArray = []
                                // ordersArray = []
                                // productsArray = []
                            })
                        })
                    })
                })
            })
        // });
    }

    render() {
        let orderDetails = this.state.orders.length ?
            (
                this.state.orders.map((order) => {

                    if (this.state.products.length > 0) {
                        let orderId = order.id
                        let orderDetails = this.state.orderDetails.filter(od => od.orderId === order.id);
                        let productIdsInOrderDetails = orderDetails.map(od => od.productId);
                        console.log("productIdsInOrderDetails")
                        console.log(productIdsInOrderDetails)
                        // debugger;
                        let products = this.state.products.filter(product => productIdsInOrderDetails.includes(product.id));
                        if (products.length > 0) {
                            // let quantity = 0;
                            let productsToReturn = products.map((product, index) => {
                                let productOrderDetail = this.state.orderDetails.find(od => od.productId === product.id && od.orderId === orderId);
                                console.log("orderDetail:" )
                                console.log(productOrderDetail)
                                // debugger;
                                console.log("Teraz w orders szukam ordera o id")
                                let order = this.state.orders.find(o => o.id ===productOrderDetail.orderId);
                                return (
                                    <div>
                                        <p>Product: {product.name}</p>
                                        <p>Address: {order ? order.address : ''} </p>
                                        <p>Quantity: {productOrderDetail.orderProductQuantity}</p>
                                        <p>Price: {product.price} $</p>
                                        <br></br>
                                    </div>
                                )
                            });
                            let total = 0;
                            products.map((product, index) => {
                                let productOrderDetail = this.state.orderDetails.find(od => od.productId === product.id && od.orderId === orderId);
                                total += product.price * productOrderDetail.orderProductQuantity;
                                // debugger;
                            });
                            return (
                                <div className="col s12 m12"
                                     style={{display: 'flex', justifyContent: 'center'}}>
                                    <div className="card" style={{width: 800}}>
                                        <div className="card-content ">
                                            <span className="card-title">Order {order.id}</span>
                                            <div className='orderDetails'>
                                                <div className="row mt-3">
                                                    {productsToReturn}
                                                </div>
                                            </div>
                                            <div>
                                                <p>Total: {total}$</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    }
                })
            ) :
            (
                <p>Nothing.</p>
            )
        console.log("wypisanie")
        console.log(this.state.orderDetails)
        console.log(this.state.products)
        console.log(this.state.orders)
        // debugger
        return (
            <div className="container">
                <br></br>
                {orderDetails}
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserOrders)
