import { axiosGet, axiosPost } from "../client";

export const _getUser = async () => await axiosGet('/v1/users/user-info')
