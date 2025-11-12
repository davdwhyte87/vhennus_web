import { Loader2 } from "lucide-react";
import type React from "react";



interface PageLoadProps  {
    loading:boolean
}
const PageLoad:React.FC<PageLoadProps> = ({loading})=>{
    if (!loading) return null;
    return(
        
        <div className="w-full flex justify-center items- text-center">
            {loading && (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
            )}

        </div>
    )
}

export default PageLoad;