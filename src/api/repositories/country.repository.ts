import { axiosGet} from "../client";

export const getAllCountries = async () => await axiosGet('/v1/countries')