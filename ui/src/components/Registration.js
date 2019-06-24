import React, {Component} from 'react';
import {getUser, signOut} from "../utils/get-api";
import {login, registration} from "../utils/post-api";
import {setIsAdmin, setIsLogin, setUser} from "./actions/cartActions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {ADMIN_EMAIL} from "./LoginMaterialize";


class Registration extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: [],
            email: '',
            password: '',
            name: '',
            surname: '',
            isRegister: false
        }

        this.postData = this.postData.bind(this)
        this.handleEmailName = this.handleEmailName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    handleName = (e) => {
        this.setState({name: e.target.value});
    };

    handleSurname = (e) => {
        this.setState({surname: e.target.value});
    };

    handleEmailName = (e) => {
        this.setState({email: e.target.value});
    };

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    };

    postData = (event) => {
        event.preventDefault();
        let email = this.state.email;
        let password = this.state.password;
        let name = this.state.name;
        let surname = this.state.surname;
        registration(name, surname, email, password).then((status) => {
            if(status === "User exist"){
                alert("User with this email exist")
            }else {
                this.setState({isRegister: true})
            }
        });
    }

    render() {
            if(!this.state.isRegister){

                return (
                    <form onSubmit={this.postData}>
                        <div className="center">
                            <br/>

                            <label htmlFor="name">Name</label>
                            <input id="name"
                                   required={true}
                                   name="name" type="text"
                                   placeholder="Enter name"
                                   onChange={this.handleName}/>

                            <label htmlFor="surname">Surname</label>
                            <input id="surname"
                                   required={true}
                                   name="surname" type="text"
                                   placeholder="Enter surname"
                                   onChange={this.handleSurname}/>

                            <label htmlFor="email">Email</label>
                            <input id="email"
                                   required={true}
                                   name="email" type="email"
                                   placeholder="Enter email"
                                   onChange={this.handleEmailName}/>

                            <label htmlFor="password">Password</label>
                            <input id="password"
                                   required={true}
                                   name="Product password" type="password"
                                   placeholder="Enter password"
                                   onChange={this.handlePassword}/>

                            <button className="waves-effect waves-light btn">Create an account</button>
                        </div>
                    </form>
                );
            }else {
                return (
                    <div>
                        <h1>
                            User <b><i>{this.state.email}</i></b> created!
                        </h1>
                    </div>
                )
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
export default connect(mapStateToProps, mapDispatchToProps)(Registration)