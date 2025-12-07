import axios from "axios";
import AppButton from "../../../Shared/components/Button"
import InputFIeld from "../../../Shared/components/InputFIeld"
import { isValidEmailStrict } from "../../../Shared/utils"
import { useAuthStore } from "../useAuthStore"
import {toast} from "react-toastify";
import { getCodeAPI, verifyEmailAPI } from "../api";

const tlogo = await  import("../../../assets/mail.png")


const ConfirmEmailPage = ()=>{
    const authStore = useAuthStore()
     
    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        authStore.setState({email:e.target.value})
    }
    const handleConfirmationCodeChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
       authStore.setState({confirmationCode:e.target.value})
    }

    const handleResendCode = async ()=>{

         if(!isValidEmailStrict(authStore.emailToBeVerified)){
            toast.error("Invalid email")
            return false
        }
        authStore.setState({isVerifyEmail:true})
        try{
            const resp = await getCodeAPI({email:authStore.emailToBeVerified})
            console.log(resp)
            toast.success("Code has been sent to your mail")

        }catch(err){
            authStore.setState({isVerifyEmail:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error verifying email")
            }else {
                toast.error("Error verifying email")
            }
            console.log(err)
        }finally{
             authStore.setState({isVerifyEmail:false})
        }
    }

     const handleConfirmEmail = async ()=>{

         if(!isValidEmailStrict(authStore.emailToBeVerified)){
            toast.error("Invalid email")
            return false
        }
        
         if(authStore.confirmationCode.length < 1){
            toast.error("Confirmation code cannot be empty")
            return false
        }
        authStore.setState({isConfirmEmailLoading:true})
        try{
            const resp = await verifyEmailAPI({email:authStore.emailToBeVerified, code:authStore.confirmationCode})
            console.log(resp)
            toast.success("Code has been sent to your mail")

        }catch(err){
            authStore.setState({isConfirmEmailLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error verifying email")
            }else {
                toast.error("Error verifying email")
            }
            console.log(err)
        }finally{
             authStore.setState({isConfirmEmailLoading:false})
        }
    }
    return (
        <div className="flex flex-col items-center w-full h-full space-y-4 p-10">
            <div><img src={tlogo.default}  className="w-32 h-32"/></div>
            <text className={'text-2xl font-bold'}>Create Account</text>
            <InputFIeld
                name="Email"
                onChange={handleEmailChange}
                placeholder="Email"
                className="w-full"
                disabled={true}
                type={'email'}
                value={authStore.emailToBeVerified}/>
            <AppButton
            className="w-full"
            size="md"
            variant="outline" 
            loading={authStore.isVerifyEmail}  
            onClick={()=>{handleResendCode()}}>Resend Code</AppButton> 
            <InputFIeld
                name="Ref"
                onChange={handleConfirmationCodeChange}
                placeholder="Referal Code"
                className="w-full"
                value={authStore.confirmationCode}/>
            <AppButton
            className="w-full"
            size="lg"  
            loading={authStore.isConfirmEmailLoading}  
            onClick={()=>{handleConfirmEmail()}}>Confirm Email</AppButton> 
            <text className="text-base underline text-center"><a href="/login">Login</a></text>
        </div>
    )
}

export default ConfirmEmailPage