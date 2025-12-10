import { Check, ChevronDown, Eye, EyeOff, Plus } from "lucide-react"
import BackHomeNav from "../../../Shared/components/BackHomeNav"
import AppButton from "../../../Shared/components/Button"
import { useWalletStore } from "../useWalletStore"
import { WalletListItem } from "../components/WalletListItem"
import { useNavigate } from "react-router-dom"



export const AllWalletsPage = ()=>{
    const walletStore = useWalletStore()
    const navigate = useNavigate()
    const handleHideSwitch = ()=>{
        console.log('hide')
        if(walletStore.hideNumbers){
            walletStore.setState({hideNumbers:false})
        }else{
            walletStore.setState({hideNumbers:true}) 
        }
    }
    return(
        <div>
            <BackHomeNav title="Wallets"/>
            <div className="flex flex-col space-y-10">
                <div className="flex flex-col w-full p-5 space-y-7 text-white bg-primary">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <AppButton
                            size="sm"
                            variant="ghost"
                            ><ChevronDown className="text-white"/>
                            </AppButton>
                            
                            <text className="p-3 text-md">NGN 50,000,000</text>
                        </div>
                        <div>
                            <div
                            onClick={()=>handleHideSwitch()}
                            >
                                {walletStore.hideNumbers? <Eye className="text-white"/>:
                                <EyeOff  className="text-white"></EyeOff>
                                }
                            </div>
                        </div>
                    </div>
                    <text  className="text-lg">Total Assets</text>
                    <text className="text-2xl font-bold">12,000,000,000</text>
                </div>
                <div className="flex flex-row px-15 justify-between">
                    <AppButton size="md" onClick={()=>navigate('add')}>
                        <div className="flex flex-col px-2">
                            <Plus/>
                            <text>Add</text>
                        </div>
                    </AppButton>
                    <AppButton size="md" onClick={()=>navigate('new')} >
                        <div className="flex flex-col px-2">
                            <Check/>
                            <text>New</text>
                        </div>
                    </AppButton>
                </div>
                <text className="text-2xl font-bold">Wallet List</text>
                <div className="px-5 flex flex-col space-y-5">
                   <WalletListItem/> 
                   <WalletListItem/>
                   <WalletListItem/>
                   <WalletListItem/>
                   <WalletListItem/>
                   <WalletListItem/>
                </div>
                
            </div>
           
        </div>
    )
}

