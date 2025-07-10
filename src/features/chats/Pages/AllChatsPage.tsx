import ChatListItem from "../Components/ChatListItem.tsx";


const AllChatsPage:React.FC = ()=>{
    return (
        <div className="flex flex-col space-y-2  min-h-screen w-full pb-safe">
            <div className="flex justify-center w-full p-5">
                <text className="text-2xl font-bold">Chats</text>
            </div>
            <div className="flex flex-col w-full">
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
            </div>

        </div>
    )
}
export default AllChatsPage