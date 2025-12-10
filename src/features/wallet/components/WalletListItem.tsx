import { Wallet } from "lucide-react"
import AppButton from "../../../Shared/components/Button"


export const WalletListItem =()=>{

    return(
        <div className="flex flex-row justify-between">
            
            <AppButton size="sm" className="rounded-full!">
                <div className="p-1">
                    <Wallet className=""/>
                </div>
            </AppButton>
            <div className="flex flex-col items-start">
                <text>ranger_team</text>
                <text>1902,0030,00 VEC</text>
            </div>
            <div className="">
                <text className="font-bold">344,333,333 NGN</text>
            </div>
        </div>
    )
    
}