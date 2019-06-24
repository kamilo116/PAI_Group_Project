import React, {Component} from 'react';
import "../style/style.css";
import {authenticate, getProducts, getUser, signOut, signOutAuth} from "../utils/get-api";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setIsAdmin, setIsLogin, setUser} from "./actions/cartActions";

const facebookLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png";
const googleLogoUrl = "https://www.ispro.pl/wp-content/uploads/2014/01/google+logo.png";
const basketLogoUrl = "https://pl.seaicons.com/wp-content/uploads/2017/02/shopping-basket-icon.png";
export const ADMIN_EMAIL = 'admin@admin.pl';

class LoginMaterialize extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            user: []
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
            if(user.length > 0 ){
                    if (user[0].email === ADMIN_EMAIL) {
                        this.props.setIsAdmin(true);
                    }
                    this.props.setIsLogin(true);
                    this.setState({user: user});
                    this.props.setUser(user);
            }
        });
    }

    signOut() {
        debugger
        signOut().then((data) => {
            this.props.setIsAdmin(false)
            this.props.setIsLogin(false);
            this.props.setUser([]);
        });

        // Silhouette signOut
        signOutAuth().then((data) => {
            this.props.setIsAdmin(false)
            this.props.setIsLogin(false);
            this.props.setUser([]);
        });
    }

    render() {
        if (this.props.user.length > 0) {
            if (this.props.user[0].email === ADMIN_EMAIL) {
                return (
                    <ul>
                        {/*<li><Link to={"/userOrders"}>Orders</Link></li>*/}
                        <li><Link to={"/adminPanel"}>Admin Panel</Link></li>
                        <li>
                            <h6>{this.props.user[0].name} {this.props.user[0].surname} </h6>
                            <h6>{this.props.user[0].email}</h6>

                        </li>
                        <li>
                            <a href="http://localhost:3000" onClick={this.signOut}>Logout</a>
                        </li>
                    </ul>
                );

            } else {
                return (
                    <ul>
                        <li><Link to={"/userOrders"}>Orders</Link></li>
                        <li>
                            <h6>{this.props.user[0].name} {this.props.user[0].surname} </h6>
                            <h6>{this.props.user[0].email}</h6>

                        </li>
                        <li>
                            <a href="http://localhost:3000" onClick={this.signOut}>Logout</a>
                        </li>
                    </ul>
                );

            }
        } else {
            return (
                <ul>
                    <li ><a href="http://localhost:9000/authenticate/facebook"><img src={facebookLogoUrl} height="30"
                                                                                    alt="facebook"/></a></li>
                    <li ><a href="http://localhost:9000/authenticate/google"><img src={googleLogoUrl} height="30"
                                                                                  alt="google"/></a></li>
                </ul>


            );
        }
    }
}


const mapStateToProps = (state) => {
    return {
        isAdmin: state.cartReducer.isAdmin,
        isLogin: state.cartReducer.isLogin,
        user: state.cartReducer.user
    }
}
const mapDispatchToProps = (dispatch) => {

    return {
        setIsAdmin: (isAdmin) => {
            dispatch(setIsAdmin(isAdmin))
        },
        setIsLogin: (isLogin) => {
            dispatch(setIsLogin(isLogin))
        },
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginMaterialize)
// export {LoginMaterialize}