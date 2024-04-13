import { axiosDelete, axiosGet, axiosPost} from "../client";

export const _addFavorite = async (data) => await axiosPost('/v1/favorites', data)
export const _removeFavorite = async (_id) => await axiosDelete(`/v1/favorites/${_id}`)
export const _getFavorites = async (_id) => await axiosGet(`/v1/favorites`)