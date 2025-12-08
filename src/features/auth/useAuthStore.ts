import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface AuthState{
    userName:string;
    email:string;
    password:string;
    confirmPassword:string;
    referralCode:string;
    signupError:string | null;
    signupLoading:boolean;

    //login
    isLoginLoading:boolean;
    //verify email
    isVerifyEmail:boolean;
    emailToBeVerified:string

    // confirmation email
    isConfirmEmailLoading:boolean;
    confirmationCode:string;

    // forgot password
    isGetChangePasswordCodeLoading:boolean
    isChangePasswordLoading:boolean

    // auth stuff
    token:string;
    authUserName:string;
    setState:(state:Partial<AuthState>)=>void
}

export const useAuthStore = create<AuthState>()(
    persist((set)=>({
        userName:'',
        email:'',
        password:'',
        confirmPassword:'',
        referralCode:'',
        signupError:null,
        signupLoading:false,

        isLoginLoading:false,
        
        isVerifyEmail:false,
        confirmationCode:'',
        isConfirmEmailLoading:false,
        emailToBeVerified:'',

        isGetChangePasswordCodeLoading:false,
        isChangePasswordLoading:false,
        token:'',
        authUserName:'',
        setState:(newState)=>set((state)=>({...state, ...newState}))

    }),
    {
        name:'auth-state',
        storage: createJSONStorage(()=>localStorage),
        partialize:(state)=>({
            token:state.token,
            emailToBeVerified:state.emailToBeVerified,
            authUserName:state.authUserName
        })
    }
)
)