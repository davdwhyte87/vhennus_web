
import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout.tsx";
import HomePage from "./features/Feed/pages/HomePage.tsx";
import AllChatsPage from "./features/chats/Pages/AllChatsPage.tsx";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import SignupPage from "./features/auth/pages/Signup.tsx";
import CreateFeedPage from './features/Feed/pages/CreateFeedPage.tsx';
import SinglePostPage from './features/Feed/pages/SinglePostPage.tsx';
import MyProfilePage from './features/profile/pages/MyProfilePage.tsx';
import EditProfilePage from './features/profile/pages/EditProfilePage.tsx';
import MenuPage from './features/menu/pages/MenuPage.tsx';
import UserProfilePage from './features/profile/pages/UserProfilePage.tsx';
import FindFriendsPage from './features/profile/pages/FindFriendsPage.tsx';
import MyFriendRequestsPage from './features/profile/pages/MyFriendRequestsPage.tsx';
import MyFriendsPage from './features/profile/pages/MyFriendsPage.tsx';
import SingleChatPage from './features/chats/Pages/SingleChatPage.tsx';
import HomePageI from './features/home/pages/HomePage.tsx';
import ConfirmEmailPage from './features/auth/pages/ConfirmEmailPage.tsx';
// import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
// import router from "./routes/routes.ts"

// const queryClient = new QueryClient()
const  App:React.FC = ()=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePageI/>}></Route>
                <Route path="login" element={<LoginPage/>}></Route>
                <Route path={"signup"} element={<SignupPage/>}></Route>
                <Route path='confirm_email' element={<ConfirmEmailPage/>}></Route>
                <Route path='home/feeds/create-post' element={<CreateFeedPage/>}></Route>
                 <Route path="home/post/:id">
                        <Route index element={<SinglePostPage/>}></Route> 
                </Route>
                <Route path="home" element={<HomeLayout/>}>
                    <Route path="feeds">
                        <Route index element={<HomePage/>}></Route> 
                    </Route>
                    <Route path='menu' element={<MenuPage/>}></Route>
                    <Route path="chats" element={<AllChatsPage/>}/>
                </Route>
                <Route path="myprofile" element={<MyProfilePage/>}></Route>
                <Route path='user_profile/:id' element={<UserProfilePage/>}></Route>
                <Route path="editprofile" element={<EditProfilePage/>}></Route>
                <Route path='find_friends' element={<FindFriendsPage/>}></Route>
                <Route path='my_friend_requests' element ={<MyFriendRequestsPage/>}></Route>
                <Route path='my_friends' element={<MyFriendsPage/>}></Route>

                <Route path='chat'>
                    <Route path='single_chat/:id' element={<SingleChatPage/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
