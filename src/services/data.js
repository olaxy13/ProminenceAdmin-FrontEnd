import { apiKit } from "./base"


export const loginAction = (data) => {
    return apiKit.post('auth/login', data)
}
export const fetchProducts = () => {
    return apiKit.get('products')
}
export const fetchProductById = (id) => {
    return apiKit.get(`products/${id}`)
}
export const updateProductById = (id,data,token) => {
    return apiKit.patch(`products/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const deleteProduct = (id,data,token) => {
    return apiKit.patch(`products/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}