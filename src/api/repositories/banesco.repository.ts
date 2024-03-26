import { axiosPost } from "../client";

export const _submitPay = async (data: any, endpoint:string = 'checkout') => await axiosPost(`/v1/${endpoint}`, data)