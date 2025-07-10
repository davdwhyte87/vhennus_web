
import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout.tsx";
import HomePage from "./features/Feed/pages/HomePage.tsx";
import AllChatsPage from "./features/chats/Pages/AllChatsPage.tsx";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import SignupPage from "./features/auth/pages/Signup.tsx";
// import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
// import router from "./routes/routes.ts"

// const queryClient = new QueryClient()
const  App:React.FC = ()=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage/>}></Route>
                <Route path={"signup"} element={<SignupPage/>}></Route>
                <Route path="home" element={<HomeLayout/>}>
                    <Route path="feeds" element={<HomePage/>}></Route>
                    <Route path="chats" element={<AllChatsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
