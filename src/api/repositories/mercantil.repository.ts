import { axiosPost } from "../client";

export const _getOTPCode = async (data: any) => await axiosPost(`/v1/mercantil/get-sms-code`, data)
export const _submitPay = async (data: any, endpoint:string = 'checkout') => await axiosPost(`/v1/${endpoint}`, data)