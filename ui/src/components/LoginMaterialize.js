import React, {Component} from 'react';
import {Nav, Image, Navbar, NavDropdown, MenuItem} from 'react-bootstrap';
import "../style/style.css";
import {authenticate, getProducts, getUser, signOut} from "../utils/get-api";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setIsAdmin, setIsLogin} from "./actions/cartActions";

const facebookLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png";
const googleLogoUrl = "https://www.ispro.pl/wp-content/uploads/2014/01/google+logo.png";
const basketLogoUrl = "https://pl.seaicons.com/wp-content/uploads/2017/02/shopping-basket-icon.png";
export const ADMIN_EMAIL = 'admin@admin.pl';
class LoginMaterialize extends Component {

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

    render() {
        // if (!this.props.firstName) {


        if(this.state.user.length <= 0){
        // if (!this.state.user.name) {
            return (
               <ul>
                   <li ><a href="http://localhost:9000/authenticate/facebook"><img src={facebookLogoUrl} height="30"
                                                                                  alt="facebook"/></a></li>
                   <li ><a href="http://localhost:9000/authenticate/google"><img src={googleLogoUrl} height="30"
                                                                                alt="google"/></a></li>
               </ul>


            );
        } else if(this.state.user[0].email === ADMIN_EMAIL){

                return (
                    <ul>
                        {/*<li><Link to={"/userOrders"}>Orders</Link></li>*/}
                        <li><Link to={"/adminPanel"}>Admin Panel</Link></li>
                        <li>
                            <h6>{this.state.user[0].name} {this.state.user[0].surname} </h6>
                            <h6>{this.state.user[0].email}</h6>

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
                        <h6>{this.state.user[0].name} {this.state.user[0].surname} </h6>
                        <h6>{this.state.user[0].email}</h6>

                    </li>
                    <li>
                        <a href="http://localhost:3000" onClick={this.signOut}>Logout</a>
                    </li>
                </ul>
            );

        }
    }
};

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

export default connect(mapStateToProps,mapDispatchToProps)(LoginMaterialize)

export {LoginMaterialize}