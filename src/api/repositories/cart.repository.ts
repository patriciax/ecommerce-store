import { axiosGet, axiosPost, axiosDelete, axiosPatch } from "../client";

export const _addToUserCart = async (data: any) => await axiosPost('/v1/carts ', data)
export const _addToMassiveCart = async (data: any) => await axiosPost('/v1/carts/mass-assignment', data)
export const _productInfo = async () => await axiosGet('/v1/carts/product-info')
export const _update = async (data: any) => await axiosPatch('/v1/carts', data)
export const _productInfoGuest = async (data: any) => await axiosPost('/v1/carts/product-info-guest', data)
export const _delete = async (id: any) => await axiosDelete(`/v1/carts/${id}`)
