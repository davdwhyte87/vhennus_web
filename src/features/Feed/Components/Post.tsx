
import {MessageSquare, Heart} from "lucide-react"

const imageTest =await import("../../../assets/react.svg")
const Post:React.FC = ()=>{

    return(
        <div className="flex flex-col  content-center border-b-2 border-gray-200 p-4">
            <div className="flex space-x-4">
                <div><img className="w-16 h-16 rounded-full object-cover" src={imageTest.default}/></div>
                <div className="flex-col space-y-1">
                    <div  className="flex flex-row gap-1">
                        <div className="flex"><text className="text-base font-bold">James Brownern</text></div>
                        <div className="flex"><text className="text-sm p-1 text-black/75">@chucksiu</text></div>

                    </div>
                    <text className="flex text-sm text-black/75">Just now</text>
                </div>
            </div>
            <div className="flex">
                <text className="text-xs text-start w-full p-0.5 py-4">
                    It’s been over a week since i posted here, and i’m Excited to share this milestone!
                    Recently i earned a certificate in small Business amd Entrepreneurship from...see more
                </text>
            </div>
            <div className="flex">
                <img className="w-full h-auto  bg-gray-50" src={imageTest.default} />
            </div>
            <div className="flex justify-end pt-6">
                <div className="flex-row flex gap-2">
                    <div className="flex flex-row gap-1">
                        <MessageSquare className="w-6 h-6"/>
                        <text className="text-xs p-1">124</text>
                    </div>
                    <div className="flex flex-row gap-1">
                        <Heart className="w-6 h-6" />
                        <text className="text-xs p-1">3,000</text>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Post