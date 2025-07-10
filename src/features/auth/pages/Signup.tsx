import InputFIeld from "../../../Shared/components/InputFIeld.tsx";
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import { signup, type SignupData} from "../api.ts";
import {toast} from "react-toastify";
import {isAllLowercase, isValidEmailStrict} from "../../../Shared/utils.ts";
import axios from "axios";


const tlogo = await  import("../../../assets/tlogo.png")

const SignupPage:React.FC = ()=>{
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [referralCode, setReferralCode] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isSignupButtonLoading, setIsSingupButtonLoading] = useState<boolean>(false);
    const handleUserNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setUserName(e.target.value)
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value)
    }
    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value)
    }
    const handleReferralCodeChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setReferralCode(e.target.value)
    }
    const handleConfirmPasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setConfirmPassword(e.target.value)
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
        setIsSingupButtonLoading(true)
        if(!validatePassword(userName,email, password, confirmPassword)){
            setIsSingupButtonLoading(false)
            return
        }
        try{
            const data:SignupData = {
                user_name: userName,
                password: password,
                email: email,
                user_type: "User",
                referral: referralCode,
            }
            const res = await signup(data)
            toast.success("Signup successful")
            console.log(res)
        }catch(err){
            setIsSingupButtonLoading(false)
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error signing up")
            }else {
                toast.error("Error signing up")
            }
            console.log(err)

        }
        finally {
            setIsSingupButtonLoading(false)
            console.log("finally")
        }
    }
    console.log(import.meta.env.VITE_API_URL)
    return (
        // oyinye , boma
        <div className="flex flex-col items-center w-full h-full space-y-4">
            <div><img src={tlogo.default}  className="w-64 h-64"/></div>
            <text className={'text-xl font-bold'}>Create Account</text>
            <InputFIeld
                name="Username"
                onChange={handleUserNameChange}
                placeholder="Username"
                className="w-full"
                value={userName}/>
            <InputFIeld
                name="Email"
                onChange={handleEmailChange}
                placeholder="Email"
                className="w-full"
                type={'email'}
                value={email}/>
            <InputFIeld
                id="password"
                name="Password"
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full"
                showIcon={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                value={password}/>
            <InputFIeld
                id="password"
                name="Confirm Password"
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className="w-full"
                showIcon={true}
                type={"password"}
                inactiveIcon={<EyeOff/>}
                activeIcon={<Eye/>}
                value={confirmPassword}/>
            <InputFIeld
                name="Ref"
                onChange={handleReferralCodeChange}
                placeholder="Referal Code"
                className="w-full"
                value={referralCode}/>

            <AppButton loading={isSignupButtonLoading}  onClick={()=>handleSignupClick()}>Signup</AppButton>
            <text className="text-base underline text-center"><a href="/login">Login</a></text>
        </div>
    )
}


export default SignupPage