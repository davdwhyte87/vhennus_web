
import {api} from '../../Shared/api.ts'

export async function login():Promise<void> {
    const {data} = await api.post('/login').then(res=>res.data)
    return data
}

export interface SignupData {
    email:string;
    user_name:string;
    user_type:string;
    password:string;
    referral:string;
}
export async function signup(data:SignupData):Promise<void> {
    const {resp} = await api.post('/create_account', data).then(res=>res.data)
    return resp
}

