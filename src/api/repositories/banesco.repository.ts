import { axiosPost } from "../client";

export const _submitPay = async (data: any) => await axiosPost('/v1/checkout ', data)