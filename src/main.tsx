import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ToastContainer} from "react-toastify";
import { LikedPostsProvider } from './features/Feed/Components/LikedPostContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LikedPostsProvider>
      <App />
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          limit={1}
          theme="colored"
      />
      </LikedPostsProvider>
  </StrictMode>,
)
