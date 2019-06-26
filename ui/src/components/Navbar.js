import {Link} from 'react-router-dom'
import LoginMaterialize, {ADMIN_EMAIL} from "./LoginMaterialize";
import React, {Component} from 'react';
import {authenticate, getProducts, getUser} from "../utils/get-api";
import {connect} from "react-redux";
import {addToCart, setIsAdmin} from "./actions/cartActions";

class Navbar extends Component {


    constructor() {
        super()
        this.state = {
            user: []
        }
    }

    componentDidMount() {
        this.getUser()
    }

    getUser() {
        getUser().then((user) => {
            this.setState({user: user});
            if (user[0] !== undefined && user[0].email === ADMIN_EMAIL) {
                this.props.setIsAdmin(true);
            }
        });
    }

    render() {
        if (this.props.user.length > 0) {
            if (this.props.user[0].email === ADMIN_EMAIL) {
                return (
                    <nav className="nav-center" role="navigation">

                        <div className="nav-wrapper">
                            <div className="container">
                                <ul className="left hide-on-med-and-down">
                                    <li><Link to="/">Shop</Link></li>
                                </ul>
                                <ul className="right">
                                    <LoginMaterialize
                                    />
                                </ul>
                            </div>
                        </div>
                    </nav>
                )

            }else {
                return (
                    <nav className="nav-center" role="navigation">

                        <div className="nav-wrapper">
                            <div className="container">
                                <ul className="left hide-on-med-and-down">
                                    {/*<Link to="/" className="brand-logo center">Shopping</Link>*/}

                                    <li><Link to="/">Shop</Link></li>
                                    <li><Link to="/cart">My cart</Link></li>
                                    <li><Link to="/cart"><i className="material-icons">shopping_cart</i></Link></li>

                                </ul>
                                <ul className="right">


                                    <LoginMaterialize
                                    />
                                </ul>
                            </div>
                        </div>
                    </nav>
                )
            }
        }else {
                return (
                    <nav className="nav-center" role="navigation">

                        <div className="nav-wrapper">
                            <div className="container">
                                <ul className="left hide-on-med-and-down">
                                    {/*<Link to="/" className="brand-logo center">Shopping</Link>*/}

                                    <li><Link to="/">Shop</Link></li>
                                    <li><Link to="/cart">My cart</Link></li>
                                    <li><Link to="/cart"><i className="material-icons">shopping_cart</i></Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/registration">Create an account</Link></li>
                                </ul>
                                <ul className="right">


                                    <LoginMaterialize
                                    />
                                </ul>
                            </div>
                        </div>
                    </nav>
                )
            }
    }
}
const mapStateToProps = (state)=>{
    return {
        isAdmin: state.cartReducer.isAdmin,
        user: state.cartReducer.user
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        setIsAdmin: (isAdmin)=>{dispatch(setIsAdmin(isAdmin))}
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Navbar)
// export default Navbar;
