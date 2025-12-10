import { Info } from "lucide-react"
import BackNav from "../../../Shared/components/BackNav"
import InputFIeld from "../../../Shared/components/InputFIeld"
import { useWalletStore } from "../useWalletStore"
import AppButton from "../../../Shared/components/Button"
import { toast } from "react-toastify"
import { isAllLowercase } from "../../../Shared/utils"
import { createWalletAPI, type CreateWalletReq } from "../api"
import axios from "axios"
import { generateKeysFromString } from "../../../Shared/keys"


export const CreateWalletPage = ()=>{
    const walletStore = useWalletStore()
     const handleAddressChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({walletAddress:e.target.value})
    }
    const handleWalletNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({walletName:e.target.value})
    }
    const handleSeedPhraseChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({seedPhrase:e.target.value})
    }
    const handleConfirmSeedPhraseChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        walletStore.setState({confirmSeedPhrase:e.target.value})
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
        if(walletStore.seedPhrase != walletStore.confirmSeedPhrase){
            toast.error("Seed Phrase does not match")
            return false
        }

        return true

    }

    const handleCreateWallet =async ()=>{
        if(!validateData()){
            return
        }
        walletStore.setState({isCreateWalletLoading:true})
        try{
            const keys = await generateKeysFromString(walletStore.seedPhrase)
            const data:CreateWalletReq ={
                address:walletStore.walletAddress,
                wallet_name:walletStore.walletName,
                public_key: keys.publicKey
            }
            const resp = await createWalletAPI(data)
            console.log('wallet result',resp)
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
                <InputFIeld
                name="Wallet Address"
                onChange={handleAddressChange}
                placeholder="Wallet Address"
                className="w-full"
                value={walletStore.walletAddress}/>
                <InputFIeld
                name="Wallet Name"
                onChange={handleWalletNameChange}
                placeholder="Wallet Name"
                className="w-full"
                value={walletStore.walletName}/>

                <InputFIeld
                name="Seed Phrase"
                onChange={handleSeedPhraseChange}
                placeholder="Seed phrase"
                className="w-full"
                value={walletStore.seedPhrase}/>

                <InputFIeld
                name="Confirm seed phrase"
                onChange={handleConfirmSeedPhraseChange}
                placeholder="Confirm seed phrase"
                className="w-full"
                value={walletStore.confirmSeedPhrase}/>

                <div className="flex flex-row text-start justify-center items-center space-x-3">
                    <Info size={64} className="text-red-500"/>
                    <text className="text-sm text-gray-600">Vhennus does not save your seed phrase, do not forget it because
                         it cannot be changed or recorvered!
                    </text>
                </div>
                <AppButton
                    className="w-full"
                    size="lg"  
                    loading={walletStore.isCreateWalletLoading}  
                    onClick={()=>handleCreateWallet()}>Create Wallet</AppButton> 
                    
            </div>
        </div>
    )
}