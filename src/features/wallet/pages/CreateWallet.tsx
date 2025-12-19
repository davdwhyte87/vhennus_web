import { Info, Shield, KeyRound, Wallet } from "lucide-react"
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <BackNav title="Create New Wallet" />
            
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
                        <Wallet className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Secure Your Digital Assets
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Create a new wallet to start managing your cryptocurrencies
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
                    <div className="space-y-8">
                        {/* Wallet Address Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <KeyRound className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Wallet Details
                                </h3>
                            </div>
                            
                            <InputFIeld
                                name="Wallet Address"
                                onChange={handleAddressChange}
                                placeholder="Enter your wallet address (lowercase only)"
                                className="w-full"
                                value={walletStore.walletAddress}
                                icon={<KeyRound className="h-5 w-5 text-gray-400" />}
                            />
                            <p className="text-sm text-gray-500 mt-1 ml-1">
                                Address must be in lowercase letters
                            </p>
                            
                            <InputFIeld
                                name="Wallet Name"
                                onChange={handleWalletNameChange}
                                placeholder="Give your wallet a name (e.g., Main Wallet)"
                                className="w-full"
                                value={walletStore.walletName}
                                icon={<Wallet className="h-5 w-5 text-gray-400" />}
                            />
                        </div>

                        {/* Seed Phrase Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Shield className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Security & Recovery
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                <InputFIeld
                                    name="Seed Phrase"
                                    onChange={handleSeedPhraseChange}
                                    placeholder="Enter your 12 or 24-word seed phrase"
                                    className="w-full"
                                    value={walletStore.seedPhrase}
                                    type="password"
                                    isPassword={true}
                                />
                                
                                <InputFIeld
                                    name="Confirm Seed Phrase"
                                    onChange={handleConfirmSeedPhraseChange}
                                    placeholder="Re-enter your seed phrase to confirm"
                                    className="w-full"
                                    value={walletStore.confirmSeedPhrase}
                                    type="password"
                                    isPassword={true}
                                />
                            </div>
                        </div>

                        {/* Security Warning */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-5">
                            <div className="flex gap-4">
                                <Info className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Important Security Notice
                                    </h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Vhennus does not save your seed phrase. Store it securely in multiple locations.
                                        <span className="font-semibold text-red-600 block mt-1">
                                            If you lose your seed phrase, your wallet cannot be recovered.
                                        </span>
                                    </p>
                                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                                            Never share your seed phrase with anyone
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                                            Store it offline in a secure location
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                                            Consider using a hardware wallet for large amounts
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Create Button */}
                        <AppButton
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"  
                            loading={walletStore.isCreateWalletLoading}  
                            onClick={()=>handleCreateWallet()}
                        >
                            {walletStore.isCreateWalletLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    Creating Wallet...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Create Secure Wallet
                                </span>
                            )}
                        </AppButton>

                        {/* Additional Info */}
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                By creating a wallet, you agree to our{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Non-Custodial</h4>
                        <p className="text-sm text-gray-600">You control your private keys and assets</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl border border-green-100 text-center">
                        <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                            <KeyRound className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Secure by Design</h4>
                        <p className="text-sm text-gray-600">End-to-end encryption for all transactions</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                        <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                            <Wallet className="h-6 w-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Multi-Chain</h4>
                        <p className="text-sm text-gray-600">Support for multiple blockchain networks</p>
                    </div>
                </div>
            </div>
        </div>
    )
}