import { axiosGet} from "../client";

export const _getItem = async () => await axiosGet(`/v1/footers/footer-front`)