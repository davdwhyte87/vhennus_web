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

export interface TransferReq{
    sender:string;
    receiver:string;
    amount:string;
    timestamp:number;
    signature:string;
    id:string

}
export async function transferAPI(data:TransferReq):Promise<GenericChainResp<string>> {
    const result = await blockChainAPI.post('/wallet/transfer', data)
    return result.data
}
