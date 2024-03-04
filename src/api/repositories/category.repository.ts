import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const getAllCategoriesMenu = async () => await axiosGet('/v1/categories/menu')