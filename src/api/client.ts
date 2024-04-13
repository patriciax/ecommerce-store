import axios from 'axios';
import { useRouter } from 'vue-router';
//import { useAuthStore } from '@/stores/authStore'
import { showNotification } from '@/composables/useNotification';
import { Console } from 'console';

const router = useRouter()

const setHeaders = () => {
    const token = localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : null
    }

    return headers
}


export const axiosPost = async (url: string, data: object) => {

    try{
        const response = await axios.post(`${(import.meta as any).env.VITE_API_URL}${url}`, data, {
            headers: setHeaders()
        })
        // console.log("response data", response)
        //errorHandling(response)
        return {status:response.status,data:response.data}
    } catch (err: any) {
        console.log("response error", err)
        // console.log("response error", err.response.data)
        return err.response.data
    }

}

export const axiosGet = async (url: string) => {

    try {
        const response = await axios.get(`${(import.meta as any).env.VITE_API_URL}${url}`, {
            headers: setHeaders()
        })

        return response.data
    } catch (err: any) {
        errorHandling(err.response)
        return err.response.data
    }

}

export const axiosPatch = async (url: string, data: object) => {

    try {
        const response = await axios.patch(`${(import.meta as any).env.VITE_API_URL}${url}`, data, {
            headers: setHeaders()
        })

        return response.data
    } catch (err: any) {
        errorHandling(err.response)
        return err.response.data
    }



}

export const axiosDelete = async (url: string) => {

    try {

        const response = await axios.delete(`${(import.meta as any).env.VITE_API_URL}${url}`, {
            headers: setHeaders()
        })

        return response.data

    } catch (err: any) {
        errorHandling(err.response)
        return err.response.data
    }


}

const errorHandling = (result: any) => {
    if (result.status === 404) {
        throw new Error(result.data)
    }

    // return result.data

    // throw new Error("404", result.data)
    // if (result.status === 401) {
    //     throw new Error("Debes iniciar sesión", result.status)
    // }

    // if (result.status === 403) {
    //     throw new Error("No tienes permisos para esta acción", result)

    // }

    // if (result.status >= 500) {
    //     throw new Error("Ha ocurrido un error", result)
    // }

    // if (result.status === 404) {
    //     throw new Error("404", result)

    // }


}