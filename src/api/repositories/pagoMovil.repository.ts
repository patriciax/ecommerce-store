import { axiosGet } from "../client";

// export const _getAllHome = async (data: any) => await axiosPost('/v1/products/product-home', data)
export const _getPagoMovil = async () => await axiosGet('/v1/pago-movil')
