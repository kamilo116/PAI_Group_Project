import React, { Component } from 'react';
import { connect } from 'react-redux'
import {addToCart, setIsLogin} from './actions/cartActions'
import cartReducer from "./reducers/cartReducer";
import {getProduct, getReviews} from "../utils/get-api";
import item1 from '../images/honey.jpg'
import {addToBasket} from "../utils/post-api";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {Alert} from "react-bootstrap";
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }

    return false;
}
class Product extends Component{

    constructor() {
        super();
        this.state = {
            products: [],
            reviews: [],
            productId: 0
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleClickNotLogin = this.handleClickNotLogin.bind(this)
        // this.getAllInformation = this.getAllInformation.bind(this)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        let productId = params.productId
        let productsArray = []
        let reviewsArray = []
        getProduct(productId).then(products => {
            console.log(products)
            products.map(product => {
                console.log("product:" + product);
                if(!productsArray.map(product=> product.id).includes(product.id)){
                    productsArray.push(product)
                }
            });
            let newState = {
                products: productsArray,
                reviews: reviewsArray,
                productId: productId
            };
            this.setState(newState)
        })

        getReviews(productId).then(reviews => {
            console.log(reviews)
            reviews.map(review => {
                console.log("review:" + review);
                reviewsArray.push(review)
            });
            let newState = {
                products: productsArray,
                reviews: reviewsArray,
                productId: productId
            };
            this.setState(newState)
        })
    }

    handleClick = (product, id)=>{
        this.props.addToCart(product);
        addToBasket(id)
    }

    handleClickNotLogin = (product, id)=>{
        alert("Please Log In");
    }

    renderOption = (json) => {
        return <option value={json.id}>{json.name}</option>
    }

    render(){
        console.log("PRODUCTS " + this.state.products)
        let products = (
            this.state.products.map((product) => {
                    return (
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3">
                                </div>
                                <div className="col-lg-9">
                                    <div className="column">
                                        <img src={item1}/>
                                    <div className="column">
                                        <h3 className="card-title">{product.name}</h3>
                                        <span to="/" className="btn-floating halfway-fab waves-effect waves-light blue"
                                              onClick={() => {
                                                  this.handleClickNotLogin(product, product.id)
                                              }}><i className="material-icons">add</i></span>
                                        <h4>{product.price} zł</h4>
                                        <p className="card-text">{product.description}</p>
                                    </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                }));

        let reviews = (
            this.state.reviews.map((review) => {
                return (
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3">
                            </div>
                            <div className="col-lg-9">
                                <div className="column">
                                    <div className="row">
                                        <h4>{review.mark}/5</h4>
                                        <p className="card-text">{review.review_content}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }));
        return (
            <div className="container">
                <br></br>
                {products}
                <br></br>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                        </div>
                        <div className="col-lg-9">
                            <div className="column">
                                <h3 className="card-title">Reviews</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {reviews}
            </div>
        );
    }
}
const mapStateToProps = (state)=>{
    return {
        addedItems: state.cartReducer.addedItems,
        isAdmin: state.cartReducer.isAdmin,
        isLogin: state.cartReducer.isLogin
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        addToCart: (product)=>{dispatch(addToCart(product))},
        setIsLogin: (isLogin)=>{dispatch(setIsLogin(isLogin))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Product)