import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Link} from "react-router-dom";
//import { addShipping } from './actions/cartActions'
class Recipe extends Component{

    // componentWillUnmount() {
    //     if(this.refs.shipping.checked)
    //         this.props.substractShipping()
    // }
    //
    // handleChecked = (e)=>{
    //     if(e.target.checked){
    //         this.props.addShipping();
    //     }
    //     else{
    //         this.props.substractShipping();
    //     }
    // }

    render(){
        if(this.props.total > 0) {


            return (
                <div className="container">
                    <div className="collection">
                        {/*<li className="collection-item">*/}
                        {/*    <label>*/}
                        {/*        <input type="checkbox" ref="shipping" onChange= {this.handleChecked} />*/}
                        {/*        <span>Shipping(+6$)</span>*/}
                        {/*    </label>*/}
                        {/*</li>*/}
                        <li className="collection-item"><b>Total: {this.props.total} $</b></li>
                    </div>
                    <div className="checkout">
                        <ul>
                            <li><Link to="/order"><button className="waves-effect waves-light btn">Checkout</button></Link></li>
                        </ul>
                    </div>
                </div>
            )
        } else {
            return (
                <div >
                </div>
            )
        }
    }
}
// connected React component will have access to the exact part of the store it needs
const mapStateToProps = (state)=>{
    return{
        addedItems: state.cartReducer.addedItems,
        total: state.cartReducer.total
    }
}

//mapDispatchToProps connects Redux actions to React props
const mapDispatchToProps = (dispatch)=>{
    return{
        addShipping: ()=>{dispatch({type: 'ADD_SHIPPING'})},
        substractShipping: ()=>{dispatch({type: 'SUB_SHIPPING'})}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recipe)