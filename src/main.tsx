import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ToastContainer} from "react-toastify";
import { LikedPostsProvider } from './features/Feed/Components/LikedPostContext.tsx';
import { WSChatProvider } from './features/chats/socket.tsx';
import { WSGroupProvider } from './features/groups/socket.tsx';
import { initPwaInstallCapture, registerServiceWorker } from './Shared/pwaInstall.ts';

initPwaInstallCapture();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LikedPostsProvider>
      <WSChatProvider>
        <WSGroupProvider>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            limit={3}
            theme="colored"
        />
        </WSGroupProvider>
      </WSChatProvider>
      </LikedPostsProvider>
  </StrictMode>,
)
