import axios from 'axios';

axios.defaults.withCredentials = false;
const BASE_URL = 'http://localhost:9000';

export {
    getProducts,
    getCategories,
    getBasket,
    authenticate,
    getProduct,
    getProductData,
    getUser,
    getOrderByUserId,
    getOrderDetailsByOrderId,
    getUsers,
    getOrders,
    getReviews
};

//used by orders
function getProduct(product_id) {
    const url = `${BASE_URL}/api/getProduct/` + product_id;
    return axios
        .get(url)
}

// used to display the product
function getProductData(product_id) {
    const url = `${BASE_URL}/api/getProduct/` + product_id;
    return axios
        .get(url)
        .then(response => response.data);
}

function getReviews(product_id) {
    const url = `${BASE_URL}/api/getReviews/byProductId/` + product_id;
    return axios
        .get(url)
        .then(response => {
            console.log(response)
            return response.data
        } )
}

function getUsers() {
    const url = `${BASE_URL}/auth/getUsers`;
    return axios
        .get(url)
        .then(response => response.data);
}

function getProducts() {
    const url = `${BASE_URL}/api/getProducts`;
    return axios
        .get(url)
        .then(response => response.data);
}

function getCategories() {
    const url = `${BASE_URL}/api/getCategories`;
    return axios
        .get(url)
        .then(response => response.data);
}

function getBasket() {
    const url = `${BASE_URL}/api/getBasket`;
    return axios
        .get(url)
        .then(response => {response.data});
}

function getUser() {
    const url = `${BASE_URL}/auth/getUser`;
    return axios
        .get(url)
        .then(response => response.data);
}



function getOrders() {
    const url = `${BASE_URL}/api/orders`;
    return axios
        .get(url)
        .then(response => response.data);
}

function getOrderByUserId(user_id) {
    const url = `${BASE_URL}/api/ordersByUserId/` + user_id;
    return axios
        .get(url)
        .then(response => response.data);
}

function getOrderDetailsByOrderId(order_id) {
    const url = `${BASE_URL}/api/orderDetailsByOrderId/` + order_id;
    return axios
        .get(url)
        .then(response => response.data);
}

function authenticate(provider) {
    const url = `${BASE_URL}/authenticate/` + provider;
    return axios
        .get(url, {withCredentials: true})
        .then(function (response) {
            console.log(response);
            // sessionStorage.setItem("CSRF", response.data);
            response.data
        })
}


export function signOut() {
    const url = `${BASE_URL}/signOut`;
    return axios
        .get(url)
        .then(function (response) {
            response.data
        })
}

// Silhouette signOut
export function signOutAuth() {
    const url = `${BASE_URL}/auth/signOut`;
    return axios
        .get(url)
        .then(function (response) {
            response.data
        })
}

