import axios from "axios";

const BASE_URL = 'http://localhost:9000';
axios.defaults.withCredentials = false;

export {updateProduct, updateCategory, updateUser};


function updateProduct(product_id, product_name, product_description, product_category, product_price) {
    const url = `${BASE_URL}/api/updateProduct/` + product_id;
    return axios.put(url, {
        product_name: product_name,
        product_description: product_description,
        product_category: parseInt(product_category, 10),
        product_price: parseInt(product_price)
    }).then(response => response.data);
}

function updateCategory(category_id, category_name) {
    const url = `${BASE_URL}/api/updateCategory/` + category_id;
    return axios.put(url, {
        category_name: category_name
    }).then(response => response.data);
}

function updateUser(user_id, user_name, user_surname, user_email) {
    const url = `${BASE_URL}/auth/updateUser/` + user_id;
    return axios.put(url, {
        user_name: user_name,
        user_surname: user_surname,
        user_email: user_email
    }).then(response => response.data);
}