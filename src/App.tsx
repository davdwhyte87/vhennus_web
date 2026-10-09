import './App.css'

import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

// Landing page stays eager — it's the first paint and is lightweight.
import LandingPage from './features/home/pages/HomePage.tsx'

// Layouts stay eager (tiny).
import HomeLayout from './layouts/HomeLayout.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import ProtectedLayout from './features/auth/components/ProtectedRoutesLayout.tsx'

// Everything else is route-split so landing visitors don't download the app.
const FeedHomePage = lazy(() => import('./features/Feed/pages/HomePage.tsx'))
const AllChatsPage = lazy(() => import('./features/chats/Pages/AllChatsPage.tsx'))
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage.tsx'))
const SignupPage = lazy(() => import('./features/auth/pages/Signup.tsx'))
const CreateFeedPage = lazy(() => import('./features/Feed/pages/CreateFeedPage.tsx'))
const SinglePostPage = lazy(() => import('./features/Feed/pages/SinglePostPage.tsx'))
const MyProfilePage = lazy(() => import('./features/profile/pages/MyProfilePage.tsx'))
const EditProfilePage = lazy(() => import('./features/profile/pages/EditProfilePage.tsx'))
const MenuPage = lazy(() => import('./features/menu/pages/MenuPage.tsx'))
const MembershipPage = lazy(() => import('./features/membership/pages/MembershipPage.tsx'))
const MembershipQuestionsPage = lazy(() => import('./features/membership/pages/MembershipQuestionsPage.tsx'))
const MembershipThankYouPage = lazy(() => import('./features/membership/pages/MembershipThankYouPage.tsx'))
const BadgesInfoPage = lazy(() => import('./features/membership/pages/BadgesInfoPage.tsx'))
const UserProfilePage = lazy(() => import('./features/profile/pages/UserProfilePage.tsx'))
const FindFriendsPage = lazy(() => import('./features/profile/pages/FindFriendsPage.tsx'))
const MyFriendRequestsPage = lazy(() => import('./features/profile/pages/MyFriendRequestsPage.tsx'))
const MyFriendsPage = lazy(() => import('./features/profile/pages/MyFriendsPage.tsx'))
const SingleChatPage = lazy(() => import('./features/chats/Pages/SingleChatPage.tsx'))
const ConfirmEmailPage = lazy(() => import('./features/auth/pages/ConfirmEmailPage.tsx'))
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPassword.tsx'))
const AdminHomePage = lazy(() => import('./features/admin/pages/AdminHomePage.tsx'))
const AdminRequestsPage = lazy(() => import('./features/admin/pages/AdminRequestsPage.tsx'))
const AdminRequestDetailPage = lazy(() => import('./features/admin/pages/AdminRequestDetailPage.tsx'))
const AdminQuestionsPage = lazy(() => import('./features/admin/pages/AdminQuestionsPage.tsx'))
const AdminUsersPage = lazy(() => import('./features/admin/pages/AdminUsersPage.tsx'))
// Named exports need remapping to a default for lazy().
const LogoutPage = lazy(() => import('./features/auth/pages/LogoutPage.tsx').then((m) => ({ default: m.LogoutPage })))
const AllWalletsPage = lazy(() => import('./features/wallet/pages/AllWalletsPage.tsx').then((m) => ({ default: m.AllWalletsPage })))
const CreateWalletPage = lazy(() => import('./features/wallet/pages/CreateWallet.tsx').then((m) => ({ default: m.CreateWalletPage })))
const AddWalletPage = lazy(() => import('./features/wallet/pages/AddWallet.tsx').then((m) => ({ default: m.AddWalletPage })))
const GroupsListPage = lazy(() => import('./features/groups/pages/GroupsListPage.tsx').then((m) => ({ default: m.GroupsListPage })))

function RouteFallback() {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-label="Loading page">
      <Loader2 className="size-6 animate-spin text-[#0A1931]" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F5F5F0] px-6 text-center text-[#0A1931]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[.14em] text-[#5d6470]">404</p>
        <h1 className="mt-3 font-serif text-4xl">Page not found.</h1>
        <a href="/" className="mt-6 inline-block border border-[#0A1931] px-5 py-3 text-[13px] hover:bg-[#0A1931] hover:text-white">Back home</a>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="confirm_email" element={<ConfirmEmailPage />} />
          <Route path="forgot_password" element={<ForgotPasswordPage />} />
          <Route path="logout" element={<LogoutPage />} />

          <Route element={<ProtectedLayout />}>
            <Route element={<HomeLayout />}>
              <Route path="home/feeds" element={<FeedHomePage />} />
              <Route
                path="home/feeds/create-post"
                element={<CreateFeedPage />}
              />
              <Route path="home/post/:id" element={<SinglePostPage />} />
              <Route path="home/menu" element={<MenuPage />} />
              <Route path="home/membership" element={<MembershipPage />} />
              <Route
                path="home/membership/badges"
                element={<BadgesInfoPage />}
              />
              <Route
                path="home/membership/questions"
                element={<MembershipQuestionsPage />}
              />
              <Route
                path="home/membership/thank-you"
                element={<MembershipThankYouPage />}
              />
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

            <Route element={<AdminLayout />}>
              <Route path="admin" element={<AdminHomePage />} />
              <Route path="admin/requests" element={<AdminRequestsPage />} />
              <Route
                path="admin/requests/:id"
                element={<AdminRequestDetailPage />}
              />
              <Route path="admin/questions" element={<AdminQuestionsPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
