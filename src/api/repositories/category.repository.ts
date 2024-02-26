import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const getAllCategoriesMenu = async (data:any) => await axiosGet('/v1/categories/menu')