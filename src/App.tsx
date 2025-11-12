
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
// import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
// import router from "./routes/routes.ts"

// const queryClient = new QueryClient()
const  App:React.FC = ()=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage/>}></Route>
                <Route path={"signup"} element={<SignupPage/>}></Route>
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
            </Routes>
        </BrowserRouter>
    )
}

export default App
