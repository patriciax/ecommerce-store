import { axiosPost} from "../client";

export const sendGiftCardBalance = async (data) => await axiosPost('/v1/gift-cards/balance', data)
export const purchaseGiftCard = async (data) => await axiosPost('/v1/gift-cards/purchase', data)