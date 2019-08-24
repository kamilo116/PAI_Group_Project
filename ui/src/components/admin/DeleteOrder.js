import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addToCart, clearAddedItems} from "../actions/cartActions";
import {Link} from "react-router-dom";
import {getOrderByUserId, getOrderDetailsByOrderId, getOrders, getProduct, getUser} from "../../utils/get-api";
import {deleteOrderDetailAndOrderByOrderId} from "../../utils/delete-api";

class DeleteOrder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderDetails: [],
            orders: [],
            products: [],
            deletedOrderId: 0
        }
        this.getOrderDetails = this
            .getOrderDetails
            .bind(this)
    }

    componentDidMount() {
        this.getOrderDetails()
    }

    getOrderDetails() {
        let orderDetailsArray = [];
        let ordersArray = [];
        let productsArray = [];
            getOrders().then(orders=>{
                orders.map(order => {
                    ordersArray.push(order)
                    getOrderDetailsByOrderId(order.id).then((orderDetails) => {
                        orderDetails.map((orderDetail) => {
                            orderDetailsArray.push(orderDetail) // to sie wykonuje x razy a potem kod nizej

                            getProduct(orderDetail.productId).then(products => {
                                products.data.map(product => {
                                    console.log("product:" + product);
                                    if(!productsArray.map(product=> product.id).includes(product.id)){
                                        productsArray.push(product)
                                    }
                                });
                                let newState = {
                                    products: productsArray,
                                    orderDetails: orderDetailsArray,
                                    orders: ordersArray
                                };
                                this.setState(newState);
                            })
                        })
                    })
                })
            })

    }

    handleDeleteAction(order_id){
        deleteOrderDetailAndOrderByOrderId(order_id)
        this.setState({deletedOrderId: order_id})

    }

    render() {
        if (this.state.deletedOrderId !== 0) {
            var index = this.state.orders.findIndex(obj => obj.id === this.state.deletedOrderId);
            this.state.orders.splice(index, 1)
        }
        let orderDetails = this.state.orders.length ?
            (
                this.state.orders.map((order) => {
                    if (this.state.products.length > 0) {
                        let orderId = order.id
                        let orderDetails = this.state.orderDetails.filter(od => od.orderId === order.id);
                        let productIdsInOrderDetails = orderDetails.map(od => od.productId);
                        let products = this.state.products.filter(product => productIdsInOrderDetails.includes(product.id));
                        if (products.length > 0) {
                            let productsToReturn = products.map((product, index) => {
                                let productOrderDetail = this.state.orderDetails.find(od => od.productId === product.id && od.orderId === orderId);
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
                            });
                            return (
                                <div className="col s12 m12"
                                     style={{display: 'flex', justifyContent: 'center'}}>
                                    <div className="card" style={{width: 800}}>
                                        <a onClick={() => this.handleDeleteAction(orderId)}
                                           className="waves-effect waves-teal btn-flat">Delete</a>
                                        <div className="card-content ">
                                            <span className="card-title">Order {orderId}</span>
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
        total: state.cartReducer.total
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteOrder)
