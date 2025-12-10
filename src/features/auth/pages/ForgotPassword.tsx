import axios from "axios";
import AppButton from "../../../Shared/components/Button"
import InputFIeld from "../../../Shared/components/InputFIeld"

import { useAuthStore } from "../useAuthStore"
import {toast} from "react-toastify";
import { changePasswordAPI,  getResetPasswordCodeAPI } from "../api";
import { Eye, EyeOff } from "lucide-react";

const tlogo = await  import("../../../assets/tlogo.png")


const ForgotPasswordPage = ()=>{
    const authStore = useAuthStore()
     
    const handleUsername = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({userName:e.target.value})
    }
    const handleConfirmationCodeChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
       authStore.setState({confirmationCode:e.target.value})
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({password:e.target.value})
    }
    const handleConfirmPasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({confirmPassword:e.target.value})
    }

    const validateData = ():boolean=>{
        if(authStore.password !== authStore.confirmPassword){
            toast.error("Passwords do not match")
            return false
        }
        if(authStore.password.length < 1){
            toast.error("Passwords cannot be empty")
            return false
        }
        if(authStore.userName.length < 1){
            toast.error("Username cannot be empty")
            return false
        }
        if(authStore.confirmationCode.length < 1){
            toast.error("Confirmation code cannot be empty")
            return false
        }
        return true;
    }


    const handleSendChangePasswordCode = async ()=>{
    
        if(authStore.userName.length < 1){
            toast.error("Username cannot be empty")
            return false
        }

        authStore.setState({isGetChangePasswordCodeLoading:true})
        try{
            const resp = await getResetPasswordCodeAPI({user_name:authStore.userName})
            console.log(resp)
            toast.success("Code has been sent to your mail")

        }catch(err){
            authStore.setState({isGetChangePasswordCodeLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error sending code")
            }else {
                toast.error("Error sending code")
            }
            console.log(err)
        }finally{
            authStore.setState({isGetChangePasswordCodeLoading:false})
        }

    }

     const handleResetPassword = async ()=>{

         if(!validateData()){
            return false
        }
        
        authStore.setState({isChangePasswordLoading:true})
        try{
            const resp = await changePasswordAPI({
                user_name:authStore.userName,
                code:authStore.confirmationCode,
                password:authStore.password,
                
                })
            console.log(resp)
            toast.success("Password has been changed. Login now.")

        }catch(err){
            authStore.setState({isChangePasswordLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error changing password")
            }else {
                toast.error("Error changing password")
            }
            console.log(err)
        }finally{
             authStore.setState({isChangePasswordLoading:false})
        }
    }
    return (
        <div className="flex flex-col items-center w-full h-full space-y-4 p-10">
            <div><img src={tlogo.default}  className="w-32 h-32"/></div>
            <text className={'text-2xl font-bold'}>Forgot Password</text>
            <InputFIeld
                name="Username"
                onChange={handleUsername}
                placeholder="Username"
                className="w-full"
                type={'email'}
                value={authStore.userName}/>
            
            <AppButton
            className="w-full"
            size="md"
            variant="outline" 
            loading={authStore.isGetChangePasswordCodeLoading}  
            onClick={()=>{handleSendChangePasswordCode()}}>Send Code</AppButton>

            <InputFIeld
                name="confirmationCode"
                onChange={handleConfirmationCodeChange}
                placeholder="Confirmation Code"
                className="w-full"
                value={authStore.confirmationCode}/>
             <InputFIeld
                name="password"
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full"
                isPassword={true}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                type={"password"}
                value={authStore.password}/>
             <InputFIeld
                name="confirmPassword"
                onChange={handleConfirmPasswordChange}
                placeholder="ConfirmPassword"
                isPassword={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                className="w-full"
                value={authStore.confirmPassword}/>

            <AppButton
            className="w-full"
            size="lg"  
            loading={authStore.isChangePasswordLoading}  
            onClick={()=>{handleResetPassword()}}>Change Password</AppButton>

            <text className="text-base underline text-center"><a href="/login">Login</a></text>

        </div>
    )
}

export default ForgotPasswordPage