import React, { Component } from 'react';
import { connect } from 'react-redux'
import {addToCart, setIsLogin} from './actions/cartActions'
import {getProduct, getReviews, getProductData} from "../utils/get-api";
import {addToBasket} from "../utils/post-api";

import t_shirt_pol from "../images/pol.jpg";
import t_shirt_arg from "../images/arg.jpg";
import t_shirt_bel from "../images/bel.jpg";
import t_shirt_fr from "../images/fr.jpg";

var tshirts = {
    "Polish": t_shirt_pol,
    "Argentinean": t_shirt_arg,
    "Belgian": t_shirt_bel,
    "French": t_shirt_fr
};

class Product extends Component{

    constructor() {
        super();
        this.state = {
            products: [],
            reviews: [],
            productId: 0
        };
        this.handleClick = this.handleClick.bind(this)
        // this.getAllInformation = this.getAllInformation.bind(this)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        let productId = params.productId
        let productsArray = []
        let reviewsArray = []
        getProductData(productId).then(products => {
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

    renderOption = (json) => {
        return <option value={json.id}>{json.name}</option>
    }

    render(){
        console.log("PRODUCTS " + this.state.products)
        let products = (
            this.state.products.map((product) => {
                if(! this.props.isAdmin) {
                    return (
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3">
                                </div>
                                <div className="col-lg-9">
                                    <div className="column">
                                        <img src={tshirts[product.name]}/>
                                        <div className="column">
                                            <h3 className="card-title">{product.name}</h3>
                                            <span to="/"
                                                  className="btn-floating halfway-fab waves-effect waves-light blue"
                                                  onClick={() => {
                                                      this.handleClick(product, product.id)
                                                  }}><i className="material-icons">add</i></span>
                                            <h4>{product.price} zł</h4>
                                            <p className="card-text">{product.description}</p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3">
                                </div>
                                <div className="col-lg-9">
                                    <div className="column">
                                        <img src={tshirts[product.name]}/>
                                        <div className="column">
                                            <h3 className="card-title">{product.name}</h3>
                                            <h4>{product.price} zł</h4>
                                            <p className="card-text">{product.description}</p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                }

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