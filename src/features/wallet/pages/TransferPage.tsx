import { Info, Send, Wallet, KeyRound, Shield, ArrowRightLeft } from "lucide-react"
import BackNav from "../../../Shared/components/BackNav"
import InputFIeld from "../../../Shared/components/InputFIeld"
import { useWalletStore } from "../useWalletStore"
import AppButton from "../../../Shared/components/Button"
import { toast } from "react-toastify"
import { isAllLowercase } from "../../../Shared/utils"
import { createWalletAPI, transferAPI, type CreateWalletReq, type TransferReq } from "../api"
import axios from "axios"
import { generateKeysFromString, getTxId, signTransaction } from "../../../Shared/keys"
import { useEffect } from "react"

export const TransferPage = () => {
    const walletStore = useWalletStore()

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        walletStore.setState({ receiverAddress: e.target.value })
    }
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        walletStore.setState({ amount: e.target.value })
    }
    const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        walletStore.setState({ seedPhrase: e.target.value })
    }

    const validateData = (): boolean => {
        if (walletStore.receiverAddress.length < 1) {
            toast.error("Wallet address cannot be empty")
            return false
        }
        if (!isAllLowercase(walletStore.walletAddress)) {
            toast.error("Wallet address should be lowercase")
            return false
        }

        if (walletStore.seedPhrase.length < 1) {
            toast.error("Seed phrase cannot be empty")
            return false
        }

        return true
    }

    const handleTransfer = async () => {
        if (!validateData()) {
            return
        }
        walletStore.setState({ isTransferLoading: true })
        try {
            const keys = await generateKeysFromString(walletStore.seedPhrase);
            const timestamp =  BigInt(Math.floor(Date.now() / 1000));
            const id = getTxId(walletStore.senderAddress, walletStore.receiverAddress, walletStore.amount, timestamp);
            const signature = signTransaction(
                walletStore.senderAddress,
                walletStore.receiverAddress,
                walletStore.amount,
                timestamp,
                id,
                keys.privateKey
            );
            const data: TransferReq = {
                id:id,
                signature:signature,
                sender:walletStore.senderAddress,
                receiver:walletStore.receiverAddress,
                amount:walletStore.amount,
                timestamp:Number(timestamp)
            }
            const resp = await transferAPI(data)

            if (resp.status == 1) {
                toast.success('Transaction successfull')
                walletStore.setState({seedPhrase:'', receiverAddress:''})
            } else {
                toast.error(resp.message || 'Transaction error')
            }
        } catch (err) {
            walletStore.setState({ isTransferLoading: false })
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Error sending transaction")
            } else {
                toast.error("Error sending transaction network")
            }
            console.log(err)
        } finally {
            walletStore.setState({ isTransferLoading: false })
        }
    }

    useEffect(()=>{
        walletStore.setState({senderAddress:"nelly_beg"})
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <BackNav title="Transfer Funds" />
            
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header Section */}
              

                {/* Transfer Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                    {/* Information Banner */}
                    

                    <div className="space-y-6">
                        {/* Recipient Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                </div>
                                Recipient Information
                            </h3>
                            
                            <InputFIeld
                                name="Recipient Wallet Address"
                                onChange={handleAddressChange}
                                placeholder="Enter recipient's wallet address (lowercase only)"
                                className="w-full"
                                value={walletStore.receiverAddress}
                                icon={<Wallet className="h-5 w-5 text-gray-400" />}
                            />
                            <p className="text-sm text-gray-500 mt-1 ml-1">
                                Double-check the address before sending
                            </p>
                        </div>

                        {/* Amount Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <div className="h-5 w-5 text-green-600 font-bold">$</div>
                                </div>
                                Transfer Amount
                            </h3>
                            
                            <div className="relative">
                            
                            
                            </div>

                            <InputFIeld
                                name="Amount"
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="w-full"
                                type="text"
                                value={walletStore.amount}
                            />
                            
                            <div className="flex justify-between items-center px-2">
                                <p className="text-sm text-gray-500">Enter amount to transfer</p>
                                <button 
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={() => walletStore.setState({ amount: 'MAX' })}
                                >
                                    Use Max Balance
                                </button>
                            </div>
                        </div>

                        {/* Security Authorization */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <Shield className="h-5 w-5 text-red-600" />
                                </div>
                                Security Authorization
                            </h3>
                            
                            <div className="space-y-4">
                                <InputFIeld
                                    name="Seed Phrase"
                                    onChange={handleSeedPhraseChange}
                                    placeholder="Enter your 12 or 24-word seed phrase to authorize"
                                    className="w-full"
                                    value={walletStore.seedPhrase}
                                    type="password"
                                    icon={<KeyRound className="h-5 w-5 text-gray-400" />}
                                    isPassword={true}
                                />
                                
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-4">
                                    <div className="flex gap-3">
                                        <Info className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700">
                                            Your seed phrase is required only to sign this transaction. 
                                            <span className="font-semibold text-red-600 block mt-1">
                                                Never share your seed phrase with anyone else.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transfer Summary */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ArrowRightLeft className="h-5 w-5 text-gray-600" />
                                Transfer Summary
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Transfer Amount (VEC)</span>
                                    <span className="font-semibold text-gray-900">
                                        ${walletStore.amount || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Amount (USD)</span>
                                    <span className="text-gray-900">$0.50</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                                    <span className="text-gray-900 font-semibold">Total</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        $
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Transfer Button */}
                        <AppButton
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                            loading={walletStore.isTransferLoading}
                            onClick={() => handleTransfer()}
                        >
                            {walletStore.isAddWalletLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing Transfer...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Confirm Transfer
                                </span>
                            )}
                        </AppButton>

                        {/* Security Footer */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Transfers are irreversible. Please verify all details before confirming.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Tips Section */}
                <div className="mt-8 bg-white rounded-xl border border-blue-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Transfer Safety Tips
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-600">Always verify the recipient address twice</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-600">Start with a small test transaction first</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-600">Check network fees before transferring</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-600">Keep your seed phrase secure and private</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}