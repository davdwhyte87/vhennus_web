import { blockChainAPI } from "../../Shared/api"


export interface CreateWalletReq{
    address:string;
    wallet_name:string;
    public_key:string;
}

export interface GenericChainResp<T>{
    status:number;
    data:T;
    message:string
}

export async function createWalletAPI(data:CreateWalletReq):Promise<GenericChainResp<string>> {
    const result = await blockChainAPI.post('/wallet/create_wallet', data)
    return result.data
}
