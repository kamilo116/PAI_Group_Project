import React, {Component} from 'react';
import {getProducts, getCategories} from '../utils/get-api';
import {addToBasket} from '../utils/post-api';

const addLogoUrl = "https://www.freeiconspng.com/uploads/cart-icon-9.png"

class Products extends Component {

  constructor() {
    super()
    this.state = {
      products: [],
      categories: []
    };
    this.addBasketItem = this
      .addBasketItem
      .bind(this)
  }

  getProducts() {
    getProducts().then((products) => {
      this.setState({products});
    });
  }

  getCategories() {
    getCategories().then((categories) => {
      this.setState({categories});
    });
  }

  componentDidMount() {
    this.getProducts();
    this.getCategories();
  }

  addBasketItem(product_id) {
    this.props.updateBasket() // zwieksza liczbe w items in basket o jeden
    addToBasket(product_id)
    this.setState()
  }

  getRelatedCategoryName(categories, product) {
    for(var idx = 0; idx < categories.length; idx++)
    {
      if(categories[idx].id === product.category)
      {
        return categories[idx].name;
      }
    }
  }

  render() {

    const {products} = this.state;
    const {categories} = this.state;
    return (
      <div>
        <h3 className="text-center"><b>Products</b></h3>
        <hr/> {products.map((product, index) => (
          <div className="col-sm-6" key={index}>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">
                    <img id="addButton" src={addLogoUrl} onClick={this.addBasketItem.bind(this, product.id)} width="30" alt="add"/> <b>{product.name} <i>({this.getRelatedCategoryName(categories, product)})</i></b>
                </h3>
              </div>
              <div className="panel-body">
                <p align="center" id="productDesc">
                  {product.description}
                </p>
                <p>
                  <br></br>
                  <i>Price: {product.price} $</i>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export {Products};