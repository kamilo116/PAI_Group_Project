import React, { Component } from 'react';
import { connect } from 'react-redux'
import {addToCart, setIsLogin} from './actions/cartActions'
import cartReducer from "./reducers/cartReducer";
import {authenticate, getCategories, getProducts, getUser} from "../utils/get-api";
import t_shirt_pol from '../images/pol.jpg'
import t_shirt_arg from '../images/arg.jpg'
import t_shirt_bel from '../images/bel.jpg'
import t_shirt_fr from '../images/fr.jpg'
import {addToBasket} from "../utils/post-api";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";

var tshirts = {
    "Polish": t_shirt_pol,
    "Argentinean": t_shirt_arg,
    "Belgian": t_shirt_bel,
    "French": t_shirt_fr
};


function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }

    return false;
}
class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categories: [],
            selectedOption: null,
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleClickNotLogin = this.handleClickNotLogin.bind(this)
        this.getAllInformation = this.getAllInformation.bind(this)
    }

    componentDidMount() {
        this.getAllInformation().then(([products, categories, user])=>{
                this.setState({categories: categories, products: products});
                this.props.setIsLogin(this.props.user !== undefined && this.props.user !== "" && this.props.user.length > 0);
            }
        )
    }

    getAllInformation(){
        return Promise.all([getProducts(), getCategories(), getUser()])
    }

    getCategories() {
        getCategories().then((categories) => {
            this.setState({categories});
        });
    }

    getProducts() {
        getProducts().then((products) => {
            this.setState({products});
        });
    }

    getRelatedCategoryName(categories, product) {
        for(var idx = 0; idx < categories.length; idx++)
        {
            if(categories[idx].id === product.category)
            {
                return categories[idx].name;
            }
        }
    }

    handleClick = (product, id)=>{
        this.props.addToCart(product);
        addToBasket(id)
    }

    handleClickNotLogin = (product, id)=>{
        alert("Please Log In");
    }


    handleProductCategoryChange = (e) => {
        this.setState({selectedOption: e.target.value});
    }

    renderOption = (json) => {
        return <option value={json.id}>{json.name}</option>
    }

    render(){
        let {products} = this.state;
        const {categories} = this.state;
        let productsTemp = [];
        let selectionOption = this.state.selectedOption;
        if(this.state.selectedOption !== null){
            if(this.state.selectedOption !== "-1"){
            productsTemp = products.filter(product=>
                product.category == this.state.selectedOption
            )
                products = productsTemp;
            }

        }

        let categoriesFilter = categories
        let all = {
            id: -1,
            name: "All"
        };
        if (!containsObject(all,categoriesFilter)) categoriesFilter.push(all);
        let itemList = [];
        if(this.state.products.length > 0) {
            if(this.props.isAdmin){
                itemList = products.map(item => {
                    let product_link = "/product/" + item.id
                    return (
                        <div className="card" key={item.id}>
                            <div className="card-image">
                                <img src={tshirts[item.name]} alt={item.name}/>
                            </div>

                            <div className="card-content">

                                <span className="card-title"><Link to={product_link} >{item.name} </Link></span>

                                <p>{item.description}</p>
                                <i>({this.getRelatedCategoryName(categories, item)})</i>
                                <p><b>Price: {item.price}$</b></p>
                            </div>
                        </div>
                    )
                })
            } else if(!this.props.isLogin){
                itemList = products.map(item => {

                    return (
                        <div className="card" key={item.id}>
                            <div className="card-image">
                                <img src={tshirts[item.name]} alt={item.name}/>
                                <span to="/" className="btn-floating halfway-fab waves-effect waves-light blue"
                                      onClick={() => {
                                          this.handleClickNotLogin(item, item.id)
                                      }}><i className="material-icons">add</i></span>
                            </div>

                            <div className="card-content">
                                <span className="card-title">{item.name}</span>
                                <p>{item.description}</p>
                                <i>({this.getRelatedCategoryName(categories, item)})</i>
                                <p><b>Price: {item.price}$</b></p>
                            </div>
                        </div>
                    )
                })
            }
            else if(this.props.isLogin){
                itemList = products.map(item => {
                    let product_link = "/product/" + item.id
                    return (
                        <div className="card" key={item.id}>
                            <div className="card-image">
                                <img src={tshirts[item.name]} alt={item.name}/>                                <span to="/" className="btn-floating halfway-fab waves-effect waves-light blue"
                                      onClick={() => {
                                          this.handleClick(item, item.id)
                                      }}><i className="material-icons">add</i></span>
                            </div>

                            <div className="card-content">
                                <span className="card-title"><Link to={product_link} >{item.name} </Link></span>

                                <p>{item.description}</p>
                                <i>({this.getRelatedCategoryName(categories, item)})</i>
                                <p><b>Price: {item.price}$</b></p>
                            </div>
                        </div>
                    )
                })
            }

        }
            return (
                <div className="container">
                    <h3 className="center">In stock</h3>

                    <label htmlFor="formControlsSelect">Choose category</label>
                    <select id="formControlsSelect"
                            required="required"
                            className="browser-default"
                            placeholder="Choose category"
                            onChange={this.handleProductCategoryChange}>
                        <option value={""} selected disabled hidden>Choose category</option>
                        {categoriesFilter.map(this.renderOption)} </select>
                    <div className="box">
                        {itemList}
                    </div>
                </div>
            )
    }
}
const mapStateToProps = (state)=>{
    return {
        // TODO zmiana
        // To chyba bierze z tego reducera wpisane z palca dane i daje do items
        // items: state.cartReducer.items
        addedItems: state.cartReducer.addedItems,
        isAdmin: state.cartReducer.isAdmin,
        isLogin: state.cartReducer.isLogin,
        user: state.cartReducer.user
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        addToCart: (product)=>{dispatch(addToCart(product))},
        setIsLogin: (isLogin)=>{dispatch(setIsLogin(isLogin))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)