import { axiosGet, axiosPost } from "../client";

// export const _getSearch = async (data: any) => await axiosPost('/v1/products/product-search ', data)






export const _getSearch = (data: any, _priceMax?: number, _priceMin?: number) => {
    let endpoint = `/v1/products/product-search`;

    if (_priceMax && _priceMin) {
        endpoint += `?price[gte]=${_priceMin}&price[lte]=${_priceMax}`;
    } else if (_priceMax) {
        endpoint += `?price[lte]=${_priceMax}`;
    } else if (_priceMin) {
        endpoint += `?price[gte]=${_priceMin}`;
    }

    return axiosPost(endpoint, data);
};


// Ofertas del día
export const _getAllProduct = (_currentPage = 1, _limit = 10, _filter = null) => {
    let endpoint = `api/v1/products/product-on-sale?page=${_currentPage}&per_page=${_limit}`
    if (_filter) endpoint += `&filter=${_filter.trim()}`
    return axiosGet(endpoint)
}

