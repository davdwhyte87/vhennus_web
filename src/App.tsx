import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomeLayout from './layouts/HomeLayout.tsx'
import HomePage from './features/Feed/pages/HomePage.tsx'
import AllChatsPage from './features/chats/Pages/AllChatsPage.tsx'
import LoginPage from './features/auth/pages/LoginPage.tsx'
import SignupPage from './features/auth/pages/Signup.tsx'
import CreateFeedPage from './features/Feed/pages/CreateFeedPage.tsx'
import SinglePostPage from './features/Feed/pages/SinglePostPage.tsx'
import MyProfilePage from './features/profile/pages/MyProfilePage.tsx'
import EditProfilePage from './features/profile/pages/EditProfilePage.tsx'
import MenuPage from './features/menu/pages/MenuPage.tsx'
import UserProfilePage from './features/profile/pages/UserProfilePage.tsx'
import FindFriendsPage from './features/profile/pages/FindFriendsPage.tsx'
import MyFriendRequestsPage from './features/profile/pages/MyFriendRequestsPage.tsx'
import MyFriendsPage from './features/profile/pages/MyFriendsPage.tsx'
import SingleChatPage from './features/chats/Pages/SingleChatPage.tsx'
import HomePageI from './features/home/pages/HomePage.tsx'
import ConfirmEmailPage from './features/auth/pages/ConfirmEmailPage.tsx'
import ForgotPasswordPage from './features/auth/pages/ForgotPassword.tsx'
import ProtectedLayout from './features/auth/components/ProtectedRoutesLayout.tsx'
import { LogoutPage } from './features/auth/pages/LogoutPage.tsx'
import { AllWalletsPage } from './features/wallet/pages/AllWalletsPage.tsx'
import { CreateWalletPage } from './features/wallet/pages/CreateWallet.tsx'
import { AddWalletPage } from './features/wallet/pages/AddWallet.tsx'
import { GroupsListPage } from './features/groups/pages/GroupsListPage.tsx'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageI />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="confirm_email" element={<ConfirmEmailPage />} />
        <Route path="forgot_password" element={<ForgotPasswordPage />} />
        <Route path="logout" element={<LogoutPage />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<HomeLayout />}>
            <Route path="home/feeds" element={<HomePage />} />
            <Route
              path="home/feeds/create-post"
              element={<CreateFeedPage />}
            />
            <Route path="home/post/:id" element={<SinglePostPage />} />
            <Route path="home/menu" element={<MenuPage />} />
            <Route path="home/chats" element={<AllChatsPage />} />
            <Route path="home/groups" element={<GroupsListPage />} />

            <Route path="myprofile" element={<MyProfilePage />} />
            <Route path="user_profile/:id" element={<UserProfilePage />} />
            <Route path="editprofile" element={<EditProfilePage />} />
            <Route path="find_friends" element={<FindFriendsPage />} />
            <Route
              path="my_friend_requests"
              element={<MyFriendRequestsPage />}
            />
            <Route path="my_friends" element={<MyFriendsPage />} />

            <Route
              path="chat/single_chat/:id"
              element={<SingleChatPage />}
            />

            <Route path="wallet" element={<AllWalletsPage />} />
            <Route path="wallet/new" element={<CreateWalletPage />} />
            <Route path="wallet/add" element={<AddWalletPage />} />

            <Route path="groups" element={<GroupsListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
