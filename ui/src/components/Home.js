import React, { Component } from 'react';
import { connect } from 'react-redux'
import {addToCart, isChecked, optionValue, setIsLogin} from './actions/cartActions'
import cartReducer from "./reducers/cartReducer";
import {authenticate, getCategories, getProducts, getUser} from "../utils/get-api";
import item1 from '../images/honey.jpg'
import {addToBasket} from "../utils/post-api";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";
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

    constructor() {
        super();
        this.state = {
            products: [],
            categories: [],
            selectedCategory: null,
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
        return Promise.all([getProducts(), getCategories()/*, getUser()*/])
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
        this.setState({selectedCategory: e.target.value});
    }

    renderOption = (json) => {
        return <option value={json.id}>{json.name}</option>
    }

    render(){
        let {products} = this.state;
        const {categories} = this.state;
        let productsTemp = [];
        let selected_options = this.props.option_value;
        if(this.state.selectedCategory !== null){
            if(this.state.selectedCategory !== "-1"){
            productsTemp = products.filter(product=>
                product.category == this.state.selectedCategory
            )
                products = productsTemp;
            }
        }
        console.log("this.state");
        console.log(this.state);

        console.log("this.props");
        console.log(this.props);

        if(selected_options !== null){
            console.log(selected_options);
            // if(this.state.selectedCategory !== "-1"){
            //     productsTemp = products.filter(product=>
            //         product.category == this.state.selectedCategory
            //     )
            //     products = productsTemp;
            // }
        }

        let categoriesFilter = categories;
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
                                <img src={item1} alt={item.name}/>
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
                                <img src={item1} alt={item.name}/>
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
                                <img src={item1} alt={item.name}/>
                                <span to="/" className="btn-floating halfway-fab waves-effect waves-light blue"
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
                    <h3 className="center">Items</h3>

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
        user: state.cartReducer.user,
        option: state.cartReducer.checkedItems,
        option_value: state.cartReducer.optionValue,
        is_checked: state.cartReducer.isChecked
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        addToCart: (product)=>{dispatch(addToCart(product))},
        setIsLogin: (isLogin)=>{dispatch(setIsLogin(isLogin))},
        optionValue: (option)=>{dispatch(optionValue(option))},
        isChecked: (option)=>{dispatch(isChecked(option))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)