import React, { Component } from 'react'
import { connect } from 'react-redux'
import {addCategory, addOrder} from "../utils/post-api";
import {Link} from "react-router-dom";
import {ADD_ORDER_STATE} from "./actions/action-types/cart-actions";
import { addOrderState } from './actions/cartActions'

class Order extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            street_address_name: '',
            street_address_number: '',
            address_postcode: '',
            city: ''
        };

        this.handleStreetChange = this
            .handleStreetChange
            .bind(this);
        this.handleAddressNumberChange = this
            .handleAddressNumberChange
            .bind(this);
        this.handlePostcodeChange = this
            .handlePostcodeChange
            .bind(this);
        this.postData = this
            .postData
            .bind(this);
        this.addOrderState = this
            .addOrderState
            .bind(this)
    }

    handleStreetChange = (e) => {
        this.setState({street_address_name: e.target.value})
    };

    handleAddressNumberChange = (e) => {
        this.setState({street_address_number: e.target.value})
    };

    handlePostcodeChange = (e) => {
        this.setState({address_postcode: e.target.value})
    };

    handleCityAddressChange = (e) => {
        this.setState({city: e.target.value})
    };


    addOrderState(){
        let order = {
            userId: 1,
            address: this.state.street_address_name
                + " "
                + this.state.street_address_number.toString(3)
                + ", "
                + this.state.city
                + " "
                + this.state.address_postcode,
        }
        this.props.addOrderState(order);
    }

    postData = (event) => {
    }

    render(){
        return(
            < form onSubmit={this.postData}>
                <div className="center">
                    <br/>

                    <label htmlFor="order_address">Order address</label>
                    <input id="street_name"
                           required={true}
                           name="Street" type="text"
                           placeholder="Enter street Name"
                           onChange={this.handleStreetChange}/>

                    <input id="address_num"
                           required={true}
                           name="Address Number" type="number"
                           placeholder="Address Number"
                           onChange={this.handleAddressNumberChange}/>

                    <input id="address_city"
                           required={true}
                           name="City" type="text"
                           placeholder="City"
                           onChange={this.handleCityAddressChange}/>

                    <input id="postcode"
                           required={true}
                           name="Order Postcode" type="text"
                           placeholder="Enter postcode"
                           onChange={this.handlePostcodeChange}/>

                    <Link to="/orderDetails" onClick={()=>{this.addOrderState()}}><button className="waves-effect waves-light btn">Summary</button></Link>

                </div>
            </form>
        )
    }
}

const mapStateToProps = (state)=>{
    return{

    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addOrderState: (order)=>{dispatch(addOrderState(order))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Order)
