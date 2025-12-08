import { useNavigate } from "react-router-dom"
import AppButton from "../../../Shared/components/Button"
import Modal from "../../../Shared/components/modal"
import { useAuthStore } from "../useAuthStore"


export const LogoutPage = ()=>{
    const navigate = useNavigate() 
    const authStore = useAuthStore()
    return(
        <div>
            <Modal
            isOpen={true} 
            onClose={()=>{}}>
                <div className="flex flex-col space-y-8">
                    <text className="font-bold text-xl">Are you sure you want to logout?</text>
                    <div className="flex flex-row justify-between">
                        <AppButton variant="outline" size="md" onClick={()=>{navigate(-1)}}>Close</AppButton>
                        <AppButton variant="primary" size="md" onClick={()=>{
                            authStore.setState({token:'', authUserName:''})
                            navigate("/login")
                        }}>Logout</AppButton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}