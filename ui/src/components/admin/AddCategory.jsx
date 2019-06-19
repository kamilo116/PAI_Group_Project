import React, {Component} from 'react';
import {FormGroup, Button, ControlLabel, HelpBlock, FormControl} from 'react-bootstrap';
import {addCategory} from '../../utils/post-api';


class AddCategory extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      category_name: '',
      category_added: false
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

  postData = (event) => {
    event.preventDefault();
    this.setState({category_added: false});
    addCategory(this.state.category_name);
    this.setState({category_added: true});
  }

  render() {
    if (!this.state.category_added) {
      return (
          < form onSubmit={this.postData}>
            <div className="center">
              <br/>
              <label htmlFor="category_name">Category name</label>
              <input id="category_name"
                     required={true}
                     name="category_name" type="text"
                     placeholder="Enter category name"
                     onChange={this.handleCategoryNameChange}/>

              <button className="waves-effect waves-light btn">Submit</button>
            </div>
          </form>
      );
    } else {
      return (
        <div>
          <h1>
            Category {this.state.category_name} added!
          </h1>
        </div>
      );
    }
  }
}

export default AddCategory;