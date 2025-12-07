
import {api} from '../../Shared/api.ts'


export interface LoginData{
    user_name:string;
    password:string;
}

export interface LoginResponse{
    token:string;
    email_confirmed:boolean;
    email:string;
}

export async function login(data:LoginData):Promise<LoginResponse> {
    const result = await api.post('/login', data)
    return result.data.data
}

export interface SignupData {
    email:string;
    user_name:string;
    user_type:string;
    password:string;
    referral:string;
}
export interface VerifyEmailData{
    email:string;
    code:string;
}

export interface GetCodeData{
    email:string;
}
export async function signup(data:SignupData):Promise<void> {
    const {resp} = await api.post('/create_account', data).then(res=>res.data)
    return resp
}


export async function verifyEmailAPI(data:VerifyEmailData):Promise<void> {
    const {resp} = await api.post('/confirm_account', data).then(res=>res.data)
    return resp
}

export async function getCodeAPI(data:GetCodeData):Promise<void> {
    const {resp} = await api.post('/resend_code', data).then(res=>res.data)
    return resp
}

