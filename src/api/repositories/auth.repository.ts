import { axiosGet, axiosPost } from "../client";

export const login = async (data:any) => await axiosPost('/v1/users/login', data)