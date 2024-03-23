import { axiosGet } from "../client";

export const _getBanner = async () => await axiosGet('/v1/banners')
