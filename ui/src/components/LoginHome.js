import React, { Component } from 'react';
import {getUser, signOut} from "../utils/get-api";
import {setIsAdmin, setIsLogin} from "./actions/cartActions";
import {connect} from "react-redux";
import {LoginMaterialize} from "./LoginMaterialize";


class LoginHome extends Component{


    constructor(props){
        super(props);
        this.state = {
            result : [],
            user : []
        }

        this.signOut = this
            .signOut
            .bind(this)
        this.getUser = this
            .getUser
            .bind(this)
    }

    componentDidMount() {
        this.getUser()
    }

    getUser(){
        getUser().then((user) => {
            this.setState({user: user});
        });
    }

    signOut() {
        signOut().then((data) => {
            this.props.setIsAdmin(false)
            this.props.setIsLogin(false);
        });
    }

    handleLogin() {
        var url = 'http://localhost:9000/login';

        fetch(url, {
            mode: 'cors',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3000',
            },
            method: 'GET',
        })
            .then(results => {
                return results.json();
            })
    }

    // handleClick = (id)=>{
    //     this.props.addToCart(id);
    // }

    render() {
        return (
            <form onSubmit={this.handleLogin}>
                <div className="center">

                    <label htmlFor="email">User email</label>
                    <input id="email" name="email" type="email" />

                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="text" />

                    <button>Login</button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        isAdmin: state.cartReducer.isAdmin,
        isLogin: state.cartReducer.isLogin
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        setIsAdmin: (isAdmin)=>{dispatch(setIsAdmin(isAdmin))},
        setIsLogin: (isLogin)=>{dispatch(setIsLogin(isLogin))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginHome)