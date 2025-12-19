import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WalletState{
    // ui stuff
    hideNumbers:boolean;

    walletAddress:string;
    walletName:string;
    seedPhrase:string;
    confirmSeedPhrase:string;
    isCreateWalletLoading:boolean;
    publicKey:string;


    // add wallet
    isAddWalletLoading:boolean;

    //transfer
    amount:string;
    senderAddress:string;
    receiverAddress:string;
    isTransferLoading:boolean;
    setState:(state:Partial<WalletState>)=>void
}

export const useWalletStore = create<WalletState>()(
    persist((set)=>({
        hideNumbers:false,
        walletAddress:'',
        walletName:'',
        seedPhrase:'',
        confirmSeedPhrase:'',
        isCreateWalletLoading:false,

        publicKey:'',

        isAddWalletLoading:false,

        amount:'',
        senderAddress:'',
        receiverAddress:'',
        isTransferLoading:false,
        setState:(newState)=>set((state)=>({...state,...newState}))
    }),
    {
        name:'wallet-store',
        storage: createJSONStorage(()=>localStorage),
        partialize: (state)=>{
            hideNumbers: state.hideNumbers
        }
    }
)
)