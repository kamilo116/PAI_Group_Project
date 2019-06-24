import React, {Component} from 'react'
import {connect} from 'react-redux'
import { addReview} from "../utils/post-api";
import { addToCart, clearAddedItems} from "./actions/cartActions";
import {Link} from "react-router-dom";
import {getOrderByUserId, getOrderDetailsByOrderId, getProduct, getUser} from "../utils/get-api";


class UserOrders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderDetails: [],
            orders: [],
            products: [],
            review_content: '',
            mark: 0
        }
        this.getOrderDetails = this
            .getOrderDetails
            .bind(this)
        this.createReview = this
            .createReview
            .bind(this)
        this.handleReviewContent = this
            .handleReviewContent
            .bind(this)
        this.handleReviewMark = this
            .handleReviewMark
            .bind(this)
    }

    componentDidMount() {
        this.getOrderDetails()
    }

    handleReviewContent = (e) => {
        this.setState({review_content: e.target.value})
    };

    handleReviewMark = (e) => {
        this.setState({mark: e.target.value})
    };

    createReview(order_id, product_id) {
        getUser().then((user) => {
            addReview( order_id, product_id, this.state.mark, this.state.review_content)
        });
    }


    getOrderDetails() {
        let orderDetailsArray = []
        let ordersArray = []
        let productsArray = []
        getUser().then((user) => {
            getOrderByUserId(user[0].id).then((orders) => {
                orders.map(order => {
                    ordersArray.push(order)
                        getOrderDetailsByOrderId(order.id).then((orderDetails) => {
                            orderDetails.map((orderDetail) => {
                                orderDetailsArray.push(orderDetail) // to sie wykonuje x razy a potem kod nizej

                                getProduct(orderDetail.productId).then(products => {
                                    products.data.map(product => {
                                        console.log("product:" + product);
                                        if (!productsArray.map(product => product.id).includes(product.id)) {
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
        });
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
                                let order = this.state.orders.find(o => o.id === productOrderDetail.orderId);
                                let is_reviewed = order.is_reviewed;
                                console.log("is_reviewed");
                                console.log(is_reviewed);
                                if(! is_reviewed) {
                                    return (
                                        <div>
                                            <div>
                                                <p>Product: {product.name}</p>
                                                <p>Address: {order ? order.address : ''} </p>
                                                <p>Quantity: {productOrderDetail.orderProductQuantity}</p>
                                                <p>Price: {product.price} $</p>
                                                <br></br>
                                            </div>
                                            <div className="review">


                                                <input id="review_content"
                                                       required={true}
                                                       name="Review Content" type="text"
                                                       placeholder="Provide review"
                                                       onChange={this.handleReviewContent}/>

                                                <input id="review_mark"
                                                       type="number"
                                                       required={true}
                                                       name="Mark" type="text"
                                                       placeholder="Provide mark"
                                                       onChange={this.handleReviewMark}/>

                                                <ul>
                                                    <li onClick={() => {
                                                        this.createReview(order.id, product.id)
                                                    }}><Link to="/">
                                                        <button className="waves-effect waves-light btn">Add review
                                                        </button>
                                                    </Link></li>
                                                </ul>


                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div>
                                            <div>
                                                <p>Product: {product.name}</p>
                                                <p>Address: {order ? order.address : ''} </p>
                                                <p>Quantity: {productOrderDetail.orderProductQuantity}</p>
                                                <p>Price: {product.price} $</p>
                                                <br></br>
                                            </div>
                                        </div>
                                    )
                                }
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

export default connect(mapStateToProps, mapDispatchToProps)(UserOrders)
