import { axiosGet} from "../client";

export const _getItem = async () => await axiosGet(`/v1/footers/footer-front-items`)
export const _getSingleItem = async (slug) => await axiosGet(`/v1/footers/footer-front/item/${slug}`)