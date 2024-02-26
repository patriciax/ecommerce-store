import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const showNotification = (text:string, type:string) => {

    if(type === 'warning') return toast.warning(text);
    if(type === 'success') return toast.success(text);
    if(type === 'error') return toast.error(text);
}