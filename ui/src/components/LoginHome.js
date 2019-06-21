import React, { Component } from 'react';
import {login, getUser, signOut} from "../utils/get-api";
import {setIsAdmin, setIsLogin} from "./actions/cartActions";
import {connect} from "react-redux";


class LoginHome extends Component {


    constructor(props) {
        super(props);
        this.state = {
            result: [],
            user: [],
            email: '',
            password: '',
            loggedIn: false
        }

        this.signOut = this
            .signOut
            .bind(this)
        this.getUser = this
            .getUser
            .bind(this)
        this.login = this
            .login
            .bind(this)
        this.handleEmailName = this
            .handleEmailName
            .bind(this);
        this.handlePassword = this
            .handlePassword
            .bind(this);
    }

    componentDidMount() {
        this.login()
    }

    getUser() {
        getUser().then((user) => {
            this.setState({user: user});
        });
    }

    login(email, password) {
        login(email, password).then((user) => {
            this.setState({user: user});
        });
    }

    signOut() {
        signOut().then((data) => {
            this.props.setIsAdmin(false)
            this.props.setIsLogin(false);
        });
    }

    handleEmailName = (e) => {
        this.setState({email: e.target.value});
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    }

    handleLogin = (event) => {
        event.preventDefault();
        this.login(this.state.email, this.state.password)
        getUser().then((user) => {
            this.setState({user: user});
        });
    }

    render() {
        if (this.state.email === '') {
            return (
                <form onSubmit={this.handleLogin}>
                    <div>
                        <br/>
                        <label htmlFor="email">Email</label>
                        <input id="email"
                               required={true}
                               name="email" type="text"
                               placeholder="Enter email"
                               onChange={this.handleEmailName}/>

                        <label htmlFor="password">Password</label>
                        <input id="password"
                               required={true}
                               name="Product password" type="text"
                               placeholder="Enter password"
                               onChange={this.handlePassword}/>

                        <button>Login</button>
                    </div>
                </form>
            );
        } else {
            return (
                <div>
                    <h1>
                        You are already logged in
                    </h1>
                </div>
            );
        }
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