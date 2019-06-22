import React, { Component } from 'react';
import {getUser, signOut} from "../utils/get-api";
import {login} from "../utils/post-api";
import {setIsAdmin, setIsLogin} from "./actions/cartActions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {ADMIN_EMAIL} from "./LoginMaterialize";


class LoginHome extends Component {


    constructor(props) {
        super(props);
        this.state = {
            result: [],
            user: [],
            email: '',
            password: ''
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
        this.getUser()

        // this.login()
    }

    getUser() {
        getUser().then((user) => {
            this.setState({user: user});
        });
    }

    login(email, password) {
        login(email, password).then((user) => {
            this.props.setIsAdmin(true);
            this.props.setIsLogin(true);
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
    }

    render() {
        if (this.state.user.length === 0) {
            return (
                <form onSubmit={this.handleLogin}>
                    <div>
                        <br/>
                        <label htmlFor="email">Email</label>
                        <input id="email"
                               required={true}
                               name="email" type="text"
                               placeholder="Enter email"
                               value={this.state.value}
                               onChange={this.handleEmailName}/>

                        <label htmlFor="password">Password</label>
                        <input id="password"
                               required={true}
                               name="Product password" type="text"
                               placeholder="Enter password"
                               value={this.state.value}
                               onChange={this.handlePassword}/>

                        <button>Login</button>
                    </div>
                </form>
            );
        } else {
            // if(this.state.user[0].email === ADMIN_EMAIL){
            //
            //     return (
            //         <ul>
            //             <li><Link to={"/adminPanel"}>Admin Panel</Link></li>
            //             <li>
            //                 <h6>{this.state.user[0].email}</h6>
            //
            //             </li>
            //             <li>
            //                 <a href="http://localhost:3000" onClick={this.signOut}>Logout</a>
            //             </li>
            //         </ul>
            //     );
            //
            // } else {
            return (
                <ul>
                    <li><Link to={"/userOrders"}>Orders</Link></li>
                    <li>
                        {/*<h6>{this.state.user[0].email}</h6>*/}

                    </li>
                    <li>
                        <a href="http://localhost:3000" onClick={this.signOut}>Logout</a>
                    </li>
                </ul>
            );
            //
            // }
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