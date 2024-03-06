import { axiosGet, axiosPost } from "../client";

export const _login = async (data: any) => await axiosPost('/v1/users/login', data)
export const _verifyEmail = async (data: any) => await axiosPost('/v1/users/verify-repeated-email', data)
export const _register = async (data: any) => await axiosPost('/v1/users/register', data)
export const _verifyCode = async (data: any) => await axiosPost('/v1/users/verify-email-otp', data)
export const _resendCode = async (data: any) => await axiosPost('/v1/users/resend-email-otp', data)
