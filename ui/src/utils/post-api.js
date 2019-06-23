import axios from 'axios';

const BASE_URL = 'http://localhost:9000';
axios.defaults.withCredentials = true;


export {addProduct, addCategory, addToBasket, addOrder, addOrderDetail, addReview};

function addProduct(product_name, product_description, product_category, product_price) {
  const url = `${BASE_URL}/api/addProduct`;
  return axios.post(url, {
    product_name: product_name,
    product_description: product_description,
    product_category: parseInt(product_category, 10),
    product_price: parseInt(product_price)
  }).then(response => response.data);
}

function addOrder(user_id, order_address) {
  const url = `${BASE_URL}/api/addOrder`;
  return axios.post(url, {
    user_id: parseInt(user_id),
    order_address: order_address,
  }).then(response => response.data);
}

function addOrderDetail(order_id, product_id,product_quantity) {
  const url = `${BASE_URL}/api/addOrderDetail`;
  return axios.post(url, {
    order_id: parseInt(order_id),
    product_id: parseInt(product_id),
    product_quantity: parseInt(product_quantity),
  }).then(response => response.data);
}

function addCategory(category_name) {
  const url = `${BASE_URL}/api/addCategory`;
  return axios
    .post(url, {category_name: category_name})
    .then(response => response.data);
}

function addToBasket(product_id) {
  const url = `${BASE_URL}/api/addToBasket`;
  return axios
    .post(url, {product_id: product_id})
    .then(response => response.data);
}

function addReview(order_id, product_id, mark, review_content) {
  const url = `${BASE_URL}/api/addReview`;
  return axios.post(url, {
    order_id: order_id,
    product_id: product_id,
    mark: parseInt(mark, 10),
    review_content: review_content
  }).then(response => response.data);
}