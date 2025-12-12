


export interface UserLocalData{
    token:string;
    user_name:string;
    image?:string;
}





export const saveUserLocalData = (data:UserLocalData)=>{ 
    localStorage.setItem("user_data", JSON.stringify(data));   
}