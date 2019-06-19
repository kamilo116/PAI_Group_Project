import React, { Component } from 'react'
import { connect } from 'react-redux'
import {addCategory, addOrder} from "../utils/post-api";
import {Link} from "react-router-dom";
import {ADD_ORDER_STATE} from "./actions/action-types/cart-actions";
import { addOrderState } from './actions/cartActions'

const defaultAddress = "ul. Midowa 65/3, Warszawa 38-400";

class Order extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            address: '',
            personal_collection: false
        };

        this.handleAddressChange = this
            .handleAddressChange
            .bind(this);
        this.handleCheckbox = this
            .handleCheckbox
            .bind(this);
        this.postData = this
            .postData
            .bind(this);
        this.addOrderState = this
            .addOrderState
            .bind(this)
    }

    handleAddressChange = (e) => {
        this.setState({address: e.target.value})
    };

    handleCheckbox = (e) => {
        let itemChecked = this.state.personal_collection
        this.setState({personal_collection: !itemChecked});
    }


    addOrderState(){
        let order = {};
        if(this.state.personal_collection) {
            order = {
                userId: 1,
                address:  defaultAddress,
                personalCollection : this.state.personal_collection
            }
        } else {
            order = {
                userId: 1,
                address: this.state.address.toString(),
                personalCollection : this.state.personal_collection
            }
        }

        this.props.addOrderState(order);
    }

    postData = (event) => {
        event.preventDefault();

        // if(this.state.personal_collection){
        //     addOrder(1, defaultAddress)
        // } else {
        //     addOrder(1, this.state.address.toString())
        // }
        // this.props.history.push('/orderDetails')
        // window.location.href = ("/orderDetails");

    }

    render(){

        if (!this.state.personal_collection){
        return(
            < form onSubmit={this.postData}>
                <div className="center">

                    <label htmlFor="order_address">Order address</label>
                    <input id="order_address"
                           required={true}
                           name="Order address" type="text"
                           placeholder="Enter order address"
                           onChange={this.handleAddressChange}/>

                        <p>
                            <label>
                                <input type="checkbox"
                                       checked={this.state.personal_collection}
                                onChange={(e)=>this.handleCheckbox(e)}/>
                                <span>Collection in Person: {defaultAddress}</span>
                            </label>
                        </p>


                    <Link to="/orderDetails" onClick={()=>{this.addOrderState()}}><button className="waves-effect waves-light btn">Summary</button></Link>

                </div>
            </form>
        )

        } else {
            return (
                < form onSubmit={this.postData}>
                    <div className="center">

                        <p>
                            <label>
                                <input type="checkbox"
                                       checked={this.state.personal_collection}
                                       onChange={(e)=>this.handleCheckbox(e)}/>
                                <span>Collection in Person: ul. Midowa 65/3, Warszawa 38-400</span>
                            </label>
                        </p>



                        <Link to="/orderDetails" onClick={()=>{this.addOrderState()}}><button className="waves-effect waves-light btn">Summary</button></Link>
                    </div>
                </form>
            );
        }
    }
}
// connected React component will have access to the exact part of the store it needs
const mapStateToProps = (state)=>{
    return{

    }
}

//mapDispatchToProps connects Redux actions to React props
const mapDispatchToProps = (dispatch)=>{
    return{
        addOrderState: (order)=>{dispatch(addOrderState(order))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Order)
// export default Order