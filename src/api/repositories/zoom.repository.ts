import { axiosGet } from "../client";

export const _getState = async () => await axiosGet('/v1/zoom/get-states')
export const _getOffices = async (_value: any) => await axiosGet(`/v1/zoom/states/${_value}/offices`)
