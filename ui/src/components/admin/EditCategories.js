import React, {Component} from 'react';
import "../../style/style.css";
import {Link} from "react-router-dom";
import {getCategories, getProducts} from "../../utils/get-api";
import {updateCategory, updateProduct} from "../../utils/put-api";



class EditCategories extends Component {


    constructor() {
        super();
        this.state = {
            categories: [],
            category_name: '',
            categoryUpdate: false,
            updatedCategory: {}
        };

        this.handleCategoryNameChange = this
            .handleCategoryNameChange
            .bind(this);
        this.postData = this
            .postData
            .bind(this);
    }

    handleCategoryNameChange = (e) => {
        this.setState({category_name: e.target.value});
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        getCategories().then((categories) => {
            this.setState({categories});
        });
    }


    handleEditAction(category) {
        this.setState({category: category, category_name: category.name})
    }

    postData = (event) => {
        event.preventDefault();
        this.setState({categoryUpdate: false});
        updateCategory(this.state.category.id, this.state.category_name);
        let category = {
            id: this.state.category.id,
            name: this.state.category_name,
        }
        this.setState({categoryUpdate: true, updatedCategory: category});
    }

    render() {
        const {categories} = this.state;
        let itemList = [];
        if(this.state.updatedCategory !== undefined && this.state.categoryUpdate ){
            var index = categories.findIndex(obj => obj.id === this.state.updatedCategory.id);
            categories[index] = this.state.updatedCategory;
        }

        if (this.state.category !== undefined && !this.state.categoryUpdate) {
            return (
                < form onSubmit={this.postData}>
                    <div className="center">
                        <br></br>
                        <label htmlFor="category_name">Category name</label>
                        <input id="category_name"
                               required={true}
                               name="category_name" type="text"
                               defaultValue={this.state.category.name}
                               onChange={this.handleCategoryNameChange}/>

                        <button className="waves-effect waves-light btn">Submit</button>
                    </div>
                </form>
            )
        } else if (this.state.categories.length > 0) {
            this.state.categoryUpdate = false;
            itemList = categories.map(item => {
                return (
                    <div className="card" key={item.id}>
                        <div className="card-image">
                            <a onClick={() => this.handleEditAction(item)}
                               className="waves-effect waves-teal btn-flat">Edit</a>
                        </div>
                        <div className="card-content">
                            <span className="card-title">{item.name}</span>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div className="container">
                <div className="box">
                    {itemList}
                </div>
            </div>
        )
    }


};
export default EditCategories;
