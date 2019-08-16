import React, {Component} from 'react';
import {getUser, signOut} from "../utils/get-api";
import {login} from "../utils/post-api";
import {setIsAdmin, setIsLogin, setUser} from "./actions/cartActions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import LoginMaterialize, {ADMIN_EMAIL} from "./LoginMaterialize";


class LoginHome extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: [],
            email: '',
            password: ''
        }
        this.postData = this.postData.bind(this)

        this.handleEmailName = this.handleEmailName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    // componentDidMount() {
    //     this.setUser()
    // }

    setUser = (e) => {
        getUser().then((user) => {
            this.setState({user: e.target.user});
            if (user[0] !== undefined && user[0].email === ADMIN_EMAIL) {
                this.props.setIsAdmin(true);
            }
        });
    }

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
        login(email, password).then((user) => {
            if (user.length > 0) {
                if (email === ADMIN_EMAIL) {
                    this.props.setIsAdmin(true);
                }
                this.props.setIsLogin(true);
                this.setState({user: user});
                this.props.setUser(user);
                this.props.history.push("");
            } else {
                alert("Wrong email or password!")
            }
        });
    }

    render() {
        return (
            <div className="center">

            <form onSubmit={this.postData}>
                <div className="center">
                    <br/>
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

                    <button className="waves-effect waves-light btn">Login</button>
                </div>

            </form>
                <div>
                    <LoginMaterialize />
                </div>
            </div>

        );
        this.props.setIsLogin(true);
        this.props.history.push("");
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginHome)