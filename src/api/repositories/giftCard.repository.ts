import { axiosGet, axiosPost } from "../client";

export const sendGiftCardBalance = async (data) => await axiosPost('/v1/gift-cards/balance', data)
export const getPrice = async () => await axiosGet('/v1/gift-cards')