


export interface UserLocalData{
    token:string;
    user_name:string;
    image?:string;
}



export const getUserLocalData = (): UserLocalData | null =>{
    try{
        const userData = localStorage.getItem("user_data");
        return userData ? JSON.parse(userData) as UserLocalData : null;

    }catch(err){
        console.error("Error getting user local data", err);
        return null;
    }

}

export const saveUserLocalData = (data:UserLocalData)=>{ 
    localStorage.setItem("user_data", JSON.stringify(data));   
}