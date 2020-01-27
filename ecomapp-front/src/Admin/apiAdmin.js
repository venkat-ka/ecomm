import {API} from '../config';
export const createCategory = (userId, token, category) => {
    
    return fetch(`${API}/category/create/${userId}`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
            Authorization : `Bearer ${token}`
        },
        body:JSON.stringify(category)
    }).then(response => {
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}

export const createProduct = (userId, token, product) => {
    
    return fetch(`${API}/product/create/${userId}`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            Authorization : `Bearer ${token}`
        },
        body:product
    }).then(response => {
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}

export const getCategories = () => {
        return fetch(`${API}/categories`,{
            method:"GET"
        })
        .then(response=>{
            return response.json()
        })
        .catch(err =>console.log(err))

}

export const listOrders = (userId, token) => {
    return fetch(`${API}/order/list/${userId}`,{
        method:"GET",
        headers:{
            Accept:"application/json",
            Authorization : `Bearer ${token}`
        },
    })
    .then(response=>{
        return response.json()
    })
    .catch(err =>console.log(err))

}

export const updateOrderStatus = (userId, token, orderId, status) => {
    return fetch(`${API}/order/${orderId}/status/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, orderId })
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.log(error));
};

export const getStatusValues = (userId, token) => {
    return fetch(`${API}/order/status-values/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
/**
 * To perform the crud Operation
 * To get all product
 * Get single Product
 * Update the single product
 * Delete the single Products
 */
export const getProducts = () => {
    return fetch(`${API}/products?limit=100`,{
        method:"GET"
    })
    .then(response=>{
        return response.json()
    })
    .catch(err =>console.log(err))

}


export const deleteProduct = (productId, userId, token) => {
    return fetch(`${API}/product/${productId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
       
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.log(error));
};


export const getProduct = (productId) => {
    return fetch(`${API}/product/${productId}`,{
        method:"GET"
    })
    .then(response=>{
        return response.json()
    })
    .catch(err =>console.log(err))

}


export const updateProduct = (productId, userId, token,product) => {
    console.log(product);
    return fetch(`${API}/product/${productId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
       body: product
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.log(error));
};
export const getCMS = (userId, token, cmsdata) => {
    
    return fetch(`${API}/cms/list/${userId}`,{
        method:"GET",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
            Authorization : `Bearer ${token}`
        },
        body:JSON.stringify(cmsdata)
    }).then(response => {
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}
export const createCMS = (userId, token, cmsdata) => {
    
    return fetch(`${API}/cms/create/${userId}`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
            Authorization : `Bearer ${token}`
        },
        body:JSON.stringify(cmsdata)
    }).then(response => {
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}
export const updateCMS = (userId, token,cmsData) => {
    
    return fetch(`${API}/cms/update/${cmsData.key}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
       body: JSON.stringify(cmsData)
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.log(error));
};


export const deleteCms = (cmsId, userId, token) => {
    return fetch(`${API}/cms/${cmsId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
       
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.log(error));
};