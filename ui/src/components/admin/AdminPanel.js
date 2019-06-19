import React, {Component} from 'react';
import "../../style/style.css";
import {Link} from "react-router-dom";

class AdminPanelRow extends Component{

    render() {
        return(
            <div className="col s12 m12"
                 style={{display: 'flex', justifyContent: 'center'}}>
                <div className="card" style={{width: 800}}>
                    <div className="card-content ">
                        <Link to={this.props.link}><a>{this.props.text}</a></Link>
                    </div>
                </div>
            </div>
        )
    }
}

class AdminPanel extends Component {


    render() {
        return (
            <div className="row">

                <AdminPanelRow link="/addProduct" text={"Add Product"}/>
                <AdminPanelRow link="/addCategory" text={"Add Category"}/>

                <AdminPanelRow link="/editProducts" text={"Edit Products"}/>
                <AdminPanelRow link="/editCategories" text={"Edit Categories"}/>
                {/*<AdminPanelRow link="/editUsers" text={"Edit Users"}/>*/}
                {/*<AdminPanelRow link="/editOrders" text={"Edit Orders"}/>*/}

                <AdminPanelRow link="/deleteProduct" text={"Delete Product"}/>
                <AdminPanelRow link="/deleteCategory" text={"Delete Category"}/>
                <AdminPanelRow link="/deleteOrder" text={"Delete Order"}/>
                {/*<AdminPanelRow link="/deleteUser" text={"Delete User"}/>*/}

            </div>
        );
    }

};
export default AdminPanel;
