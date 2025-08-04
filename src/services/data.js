import { apiKit } from "./base"
import { apiKitForm } from "./base"


export const loginAction = (data) => {
    return apiKit.post('auth/login', data)
}
export const fetchProducts = (pageNumber) => {
    return apiKit.get(`products?page=${pageNumber}`)
}
export const fetchProductById = (id) => {
    return apiKit.get(`products/${id}`)
}
export const updateProductById = (id,data,token) => {
    return apiKitForm.patch(`products/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const addProduct = (data,token) => {
    return apiKitForm.post(`products`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const deleteProduct = (id,data,token) => {
    return apiKit.delete(`products/${id}`, {data,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}