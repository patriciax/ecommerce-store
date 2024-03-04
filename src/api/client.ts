import axios from 'axios';
import { useRouter } from 'vue-router';
//import { useAuthStore } from '@/stores/authStore'
import {showNotification} from '@/composables/useNotification';

const router = useRouter()

const setHeaders = () => {
    const token = localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    return headers
}


export const axiosPost = async(url:string, data:object) => {

    try{
        const response = await axios.post(`${(import.meta as any).env.VITE_API_URL}${url}`, data, {
            headers: setHeaders()
        })
        
        return response.data
    }catch(err: any){
        errorHandling(err.response)
        return err.response.data
    }

}

export const axiosGet = async(url:string) => {

    try{
        const response = await axios.get(`${(import.meta as any).env.VITE_API_URL}${url}`, {
            headers: setHeaders()
        })
    
        return response.data
    }catch(err: any){
        errorHandling(err.response)
        return err.response.data
    }

}

export const axiosPatch = async(url:string, data:object) => {

    try{
        const response = await axios.patch(`${(import.meta as any).env.VITE_API_URL}${url}`, data, {
            headers: setHeaders()
        })

        return response.data
    }catch(err: any){
        errorHandling(err.response)
        return err.response.data
    }
    
    

}

export const axiosDelete = async(url:string) => {

    try{

        const response = await axios.delete(`${(import.meta as any).env.VITE_API_URL}${url}`, {
            headers: setHeaders()
        })

        return response.data

    }catch(err: any){
        errorHandling(err.response)
        return err.response.data
    }
    

}

const errorHandling = (result:any) => {

    // const authStore = useAuthStore()
    
    // if(result.status === 401){
    //     localStorage.removeItem(import.meta.env.VITE_BEARER_TOKEN_KEY)
    //     authStore.setUser(null)
    //     showNotification("Debes iniciar sesión", "error")
    //     router.push({name: 'login'})
    //     return
    // }

    // if(result.status === 403){
    //     showNotification("No tienes permisos para esta acción", "error")
    //     return
    // }

    // if(result.status >= 500){
    //     showNotification("Ha ocurrido un error", "error")
    //     return
    // }


}