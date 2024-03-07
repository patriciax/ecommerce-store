import { axiosGet, axiosPost } from "../client";

// export const _getAllHome = async (data: any) => await axiosPost('/v1/products/product-home', data)
export const _getAllHome = async () => await axiosGet('/v1/products/product-home')
export const _getSingleProduct = async (id: any) => await axiosGet(`/v1/products/${id}`)
