import { axiosGet } from "../client";

export const _getInvoices = async (page: any, limit: any) => await axiosGet(`/v1/invoices/user?page=${page}&limit=${limit}`)
