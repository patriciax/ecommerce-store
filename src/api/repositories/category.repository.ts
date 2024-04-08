import { axiosGet } from "../client";

export const getAllCategoriesMenu = async () => await axiosGet('/v1/categories/menu')
export const _getCategory = async (category: any, page: any, limit: any) => await axiosGet(`/v1/products/category/${category}?page=${page}&limit=${limit}`)