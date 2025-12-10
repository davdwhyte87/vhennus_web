import InputFIeld from "../../../Shared/components/InputFIeld.tsx";

import {Eye, EyeOff} from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import { signup, type SignupData} from "../api.ts";
import {toast} from "react-toastify";
import {isAllLowercase, isValidEmailStrict} from "../../../Shared/utils.ts";
import axios from "axios";
import { useAuthStore } from "../useAuthStore.ts";
import { useNavigate } from "react-router-dom";


const tlogo = await  import("../../../assets/tlogo.png")

const SignupPage:React.FC = ()=>{
    const authStore = useAuthStore()
    const navigate = useNavigate()


    const handleUserNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({userName:e.target.value})
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({password:e.target.value})
    }
    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({email:e.target.value})
    }
    const handleReferralCodeChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
       authStore.setState({referralCode:e.target.value})
    }
    const handleConfirmPasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({confirmPassword:e.target.value})
    }

    const validatePassword = (userName:string,email:string, password:string, confirmPassword:string):boolean=>{
        if(password !== confirmPassword){
            toast.error("Passwords do not match")
            return false
        }
        if(password.length < 1){
            toast.error("Passwords cannot be empty")
            return false
        }
        if(userName.length < 1){
            toast.error("Username cannot be empty")
            return false
        }
        if(!isAllLowercase(userName)){
            toast.error("Username should be lowercase")
            return false
        }
        if(!isValidEmailStrict(email)){
            toast.error("Invalid email")
            return false
        }
        return true

    }
    const handleSignupClick = async ()=>{
        
        if(!validatePassword(authStore.userName,authStore.email, authStore.password, authStore.confirmPassword)){
            return
        }

        authStore.setState({signupLoading:true})
        try{
            const data:SignupData = {
                user_name: authStore.userName,
                password: authStore.password,
                email: authStore.email,
                user_type: "User",
                referral: authStore.referralCode,
            }
            const res = await signup(data)
            toast.success("Signup successful")
            console.log(res)
            authStore.setState({emailToBeVerified:authStore.email})
            navigate("/confirm_email")
        }catch(err){
            authStore.setState({signupLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error signing up")
            }else {
                toast.error("Error signing up")
            }
            console.log(err)

        }
        finally {
            authStore.setState({signupLoading:false})
            console.log("finally")
        }
    }
   
    return (
        // oyinye , boma
        <div className="flex flex-col items-center w-full h-full space-y-4 p-10">
            <div><img src={tlogo.default}  className="w-32 h-32"/></div>
            <text className={'text-2xl font-bold'}>Create Account</text>
            <InputFIeld
                name="Username"
                onChange={handleUserNameChange}
                placeholder="Username"
                className="w-full"
                value={authStore.userName}/>
            <InputFIeld
                name="Email"
                onChange={handleEmailChange}
                placeholder="Email"
                className="w-full"
                type={'email'}
                value={authStore.email}/>
            <InputFIeld
                id="password"
                name="Password"
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full"
                isPassword={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                value={authStore.password}/>
            <InputFIeld
                id="password"
                name="Confirm Password"
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className="w-full"
                isPassword={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                value={authStore.confirmPassword}/>
            <InputFIeld
                name="Ref"
                onChange={handleReferralCodeChange}
                placeholder="Referal Code"
                className="w-full"
                value={authStore.referralCode}/>

        
            <AppButton
            className="w-full"
            size="lg"  
            loading={authStore.signupLoading}  
            onClick={()=>handleSignupClick()}>Signup</AppButton> 
            
            <text className="text-base underline text-center"><a href="/login">Login</a></text>
        </div>
    )
}


export default SignupPage