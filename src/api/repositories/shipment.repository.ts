import { axiosPost } from "../client";

export const _getRates = async (data: any) => await axiosPost('/v1/shipment/', data)
