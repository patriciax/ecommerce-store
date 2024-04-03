import { axiosGet } from "../client";

export const _searchProduct = (_currentPage = 1, _limit = 10, _filter = null) => {
    let endpoint = `api/v1/?page=${_currentPage}&per_page=${_limit}`
    if (_filter) endpoint += `&filter=${_filter.trim()}`
    return axiosGet(endpoint)
}

// Ofertas del día
export const _getAllProduct = (_currentPage = 1, _limit = 10, _filter = null) => {
    let endpoint = `api/v1/products/product-on-sale?page=${_currentPage}&per_page=${_limit}`
    if (_filter) endpoint += `&filter=${_filter.trim()}`
    return axiosGet(endpoint)
}

