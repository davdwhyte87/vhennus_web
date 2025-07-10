
const prof = await import("../../../assets/react.svg")

const ChatListItem:React.FC = ()=>{

    return (
        <div className="flex flex-row space-x-2 p-2">
            <div>
                <img src={prof.default}  className="rounded-full w-16 h-16" />
            </div>
            <div className="flex flex-col space-y-1">
                <div className="text-start font-bold">John Sam <span className="text-black/30">@reggan_nuew</span></div>
                <div className="text-start">THis is the very  saying this but...</div>
            </div>
            <div className="flex flex-col items-end ml-auto ">
                <div className="text-end ">Just now</div>
                <div className="flex rounded-full w-3 h-3 bg-primary text-end justify-end">  </div>
            </div>
        </div>
    )
}

export default ChatListItem;