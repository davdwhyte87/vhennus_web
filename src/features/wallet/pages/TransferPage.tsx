
import { Info } from "lucide-react"
import BackNav from "../../../Shared/components/BackNav"
import InputFIeld from "../../../Shared/components/InputFIeld"
import { useWalletStore } from "../useWalletStore"
import AppButton from "../../../Shared/components/Button"
import { toast } from "react-toastify"
import { isAllLowercase } from "../../../Shared/utils"
import { createWalletAPI, type CreateWalletReq } from "../api"
import axios from "axios"


export const TransferPage = ()=>{
    const walletStore = useWalletStore()

     const handleAddressChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({walletAddress:e.target.value})
    }
    const handleAmountChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({amount:e.target.value})
    }
    const handleSeedPhraseChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({seedPhrase:e.target.value})
    }
    

    const validateData = ():boolean=>{
        if(walletStore.walletAddress.length < 1){
            toast.error("Wallet address cannot be empty")
            return false
        }
        if(!isAllLowercase(walletStore.walletAddress)){
            toast.error("Wallet address should be lowercase")
            return false
        }

        if(walletStore.seedPhrase.length < 1){
            toast.error("Seed phrase cannot be empty")
            return false
        }
      

        return true

    }

    const handleAddWallet =async ()=>{
        if(!validateData()){
            return
        }
        walletStore.setState({isCreateWalletLoading:true})
        try{
            const data:CreateWalletReq ={
                address:walletStore.walletAddress,
                wallet_name:walletStore.walletName,
                public_key:walletStore.publicKey
            }
            const resp = await createWalletAPI(data)

            if(resp.status == 1){
                toast.success('Wallet has been created')
            }else{
                toast.error(resp.message||'Error creating wallet' )
            }
        }catch(err){
            walletStore.setState({isCreateWalletLoading:false})
            if (axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"Error creating wallet")
            }else {
                toast.error("Error creating wallet")
            }
            console.log(err)
        }finally{
               walletStore.setState({isCreateWalletLoading:false})
        }
    }
    return (
        <div>
            <BackNav title="Create Wallet"/>
            <div className="flex flex-col space-y-5 p-10">
                <div className="flex flex-row text-start justify-center items-center space-x-3">
                    <Info size={64} className="text-blue-400"/>
                    <text className="text-sm text-gray-600">
                        To import your existing wallet, please enter the seed phrase you 
                        created during the wallet creation.
                    </text>
                </div>
                <InputFIeld
                name="Wallet Address"
                onChange={handleAddressChange}
                placeholder="Wallet Address"
                className="w-full"
                value={walletStore.walletAddress}/>
               
                <InputFIeld
                name="Amount"
                onChange={handleAmountChange}
                placeholder="Amount"
                className="w-full"
                type="number"
                value={walletStore.amount}/>

                <InputFIeld
                name="Seed Phrase"
                onChange={handleSeedPhraseChange}
                placeholder="Seed phrase"
                className="w-full"
                value={walletStore.seedPhrase}/>

             
                
                <AppButton
                    className="w-full"
                    size="lg"  
                    loading={walletStore.isAddWalletLoading}  
                    onClick={()=>handleAddWallet()}>Transfer</AppButton> 
                    
            </div>
        </div>
    )
}