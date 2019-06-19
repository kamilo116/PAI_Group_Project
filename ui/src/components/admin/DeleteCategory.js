import React, {Component} from 'react';
import "../../style/style.css";
import {Link} from "react-router-dom";
import {getCategories} from "../../utils/get-api";
import {updateCategory} from "../../utils/put-api";
import {deleteCategory} from "../../utils/delete-api";



class DeleteCategory extends Component {


    constructor() {
        super();
        this.state = {
            categories: [],
           deletedCategoryId: 0
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        getCategories().then((categories) => {
            this.setState({categories});
        });
    }


    handleDeleteAction(categoryId) {
        deleteCategory(categoryId)
        this.setState({deletedCategoryId: categoryId})
    }


    render() {
        const {categories} = this.state;
        if (this.state.deletedCategoryId !== 0) {
            var index = categories.findIndex(obj => obj.id === this.state.deletedCategoryId);
            categories.splice(index, 1)
        }

            let itemList = categories.map(item => {
                return (
                    <div className="card" key={item.id}>
                        <div className="card-image">
                            <a onClick={() => this.handleDeleteAction(item.id)}
                               className="waves-effect waves-teal btn-flat">Delete</a>
                        </div>
                        <div className="card-content">
                            <span className="card-title">{item.name}</span>
                        </div>
                    </div>
                )
            })

        return (
            <div className="container">
                <div className="box">
                    {itemList}
                </div>
            </div>
        )
    }

};
export default DeleteCategory;
