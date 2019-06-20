import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {browserHistory, Router} from "react-router";
import AddProduct from "./components/admin/AddProduct";
import OrderDetails from "./components/OrderDetails";
import Order from "./components/Order";
import Product from "./components/Product";
import AddCategory from "./components/admin/AddCategory";
import Cart from "./components/Cart";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import UserOrders from "./components/UserOrders";
import AdminPanel from "./components/admin/AdminPanel";
import EditProducts from "./components/admin/EditProducts";
import EditCategories from "./components/admin/EditCategories";
import EditOrders from "./components/admin/EditOrders";
import DeleteProduct from "./components/admin/DeleteProduct";
import DeleteCategory from "./components/admin/DeleteCategory";
import DeleteOrder from "./components/admin/DeleteOrder";
import DeleteUser from "./components/admin/DeleteUser";

class App extends Component {


    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Navbar/>
                    <Switch>
                        {/*<Router history={browserHistory}>*/}
                            <Route exact path="/" component={Home}/>
                            <Route path="/cart" component={Cart}/>
                            <Route path="/order" component={Order}/>
                            <Route path="/orderDetails" component={OrderDetails}/>
                            <Route path="/userOrders" component={UserOrders}/>

                            <Route path="/adminPanel" component={AdminPanel}/>
                            <Route path="/addProduct" component={AddProduct}/>
                            <Route path="/addCategory" component={AddCategory}/>
                            <Route path="/editProducts" component={EditProducts}/>
                            <Route path="/editCategories" component={EditCategories}/>
                            {/*<Route path="/editUsers" component={EditUser}/>*/}
                            <Route path="/editOrders" component={EditOrders}/>

                            <Route path="/DeleteProduct" component={DeleteProduct}/>
                            <Route path="/DeleteCategory" component={DeleteCategory}/>
                            <Route path="/DeleteOrder" component={DeleteOrder}/>
                            <Route path="/DeleteUser" component={DeleteUser}/>

                            <Route path="/product/:productId" component={Product}/>
                        {/*</Router>*/}
                    </Switch>
                </div>
            </BrowserRouter>

        );
    }
}

export default App;
