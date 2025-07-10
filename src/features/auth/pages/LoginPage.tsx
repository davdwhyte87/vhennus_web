import InputFIeld from "../../../Shared/components/InputFIeld.tsx";
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import AppButton from "../../../Shared/components/Button.tsx";
import {login} from "../api.ts";
import {toast} from "react-toastify";


const tlogo = await  import("../../../assets/tlogo.png")

const LoginPage:React.FC = ()=>{
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoginButtonLoading, setIsLoginButtonLoading] = useState<boolean>(false);
    const handleUserNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setUserName(e.target.value)
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value)
    }

    const handleLoginClick = async ()=>{
        setIsLoginButtonLoading(true)
        try{
            const res = await login()
            console.log(res)
        }catch(err){
            setIsLoginButtonLoading(false)
            console.log(err)
            toast.error("Error logging in")
        }
        finally {
            setIsLoginButtonLoading(false)
            console.log("finally")
        }
    }
    console.log(import.meta.env.VITE_API_URL)
    return (
        // oyinye , boma
        <div className="flex flex-col items-center w-full h-full space-y-4">
            <div><img src={tlogo.default}  className="w-64 h-64"/></div>
            <InputFIeld
                name="Username"
                onChange={handleUserNameChange}
                placeholder="Username"
                className="w-full"
                value={userName}/>
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

            <AppButton loading={isLoginButtonLoading}  onClick={()=>handleLoginClick()}>Login</AppButton>
            <text className="text-base underline text-center"><a href="/signup">Sign up</a></text>
        </div>
    )
}


export default LoginPage