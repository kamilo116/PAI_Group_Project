import axios from 'axios';

const BASE_URL = 'http://localhost:9000';
axios.defaults.withCredentials = false;

export {deleteFromBasket, deleteCategory, deleteProduct, deleteOrderDetail, deleteUser, deleteOrderDetailAndOrderByOrderId};

function deleteFromBasket(product_id) {
  const url = `${BASE_URL}/api/deleteFromBasket/` + product_id;
  return axios
    .delete(url)
    .then(response => response.data);
}

function deleteProduct(product_id) {
  const url = `${BASE_URL}/api/deleteProduct/` + product_id;
  return axios
      .delete(url)
      .then(response => response.data);
}

function deleteCategory(category_id) {
  const url = `${BASE_URL}/api/deleteCategory/` + category_id;
  return axios
      .delete(url)
      .then(response => response.data);
}

function deleteOrderDetail(order_detail_id) {
    const url = `${BASE_URL}/api/deleteOrderDetail/` + order_detail_id;
    return axios
        .delete(url)
        .then(response => response.data);
}

function deleteOrderDetailAndOrderByOrderId(order_id) {
    const url = `${BASE_URL}/api/deleteOrderDetailAndOrderByOrderId/` + order_id;
    return axios
        .delete(url)
        .then(response => response.data);
}

function deleteUser(user_id) {
    const url = `${BASE_URL}/auth/deleteUser/` + user_id;
    return axios
        .delete(url)
        .then(response => response.data);
}


