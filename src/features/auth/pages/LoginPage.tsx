import InputFIeld from "../../../Shared/components/InputFIeld.tsx";

import {Eye, EyeOff} from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import {login, type LoginData} from "../api.ts";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../useAuthStore.ts";
import axios from "axios";


const tlogo = await  import("../../../assets/tlogo.png")

const LoginPage:React.FC = ()=>{
    
    const navigate = useNavigate();
    const authStore = useAuthStore()


    const handleUserNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({userName:e.target.value})
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({password:e.target.value})
    }

    const handleLoginClick = async ()=>{

        authStore.setState({isLoginLoading:true})
        try{
            const loginData:LoginData={
                user_name:authStore.userName,
                password:authStore.password
            }
            const res = await login(loginData)
            authStore.setState({token:res.token, authUserName:authStore.userName})
            console.log("Login successful token ----", res.token)
            if(res.email_confirmed){
               navigate("/home/feeds") 
            }else{
                authStore.setState({emailToBeVerified:res.email})
                navigate("/verify_email")   
            }
            
        }catch(err){
              authStore.setState({isLoginLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error logging in")
            }else {
                toast.error("Error logging in")
            }
        
        }
        finally {
            authStore.setState({isLoginLoading:false})
            
        }
    }
    console.log(import.meta.env.VITE_API_URL)
    return (
        // oyinye , boma
        <div className="flex flex-col items-center p-5 w-full h-full space-y-4">
            <div><img src={tlogo.default}  className="w-32 h-32"/></div>
            <InputFIeld
                name="Username"
                onChange={handleUserNameChange}
                placeholder="Username"
                className="w-full"
                value={authStore.userName}/>
            <InputFIeld
                id="password"
                name="Password"
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full"
                showIcon={false}
                isPassword ={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                value={authStore.password}/>
            <div>
                <AppButton size="lg" loading={authStore.isLoginLoading}  onClick={()=>handleLoginClick()}>Login</AppButton>
            </div>
            <text className="text-base underline text-center"><a href="/signup">Sign up</a></text>
            
            <text className="text-base underline text-center"><a href="/forgot_password">Forgot Password?</a></text>

        </div>
    )
}


export default LoginPage