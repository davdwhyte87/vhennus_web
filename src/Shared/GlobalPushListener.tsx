import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  startForegroundPushListener,
  subscribeForegroundPush,
} from './firebase'

/**
 * App-wide FCM foreground listener.
 *
 * Must live inside the router and outside the protected layouts: when any
 * visible client exists the browser suppresses the OS notification and
 * forwards the push to the page instead. Mounting this only in HomeLayout
 * meant pushes were swallowed whenever the app was open on a public route
 * (landing, login, signup, …).
 */
const GlobalPushListener: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    startForegroundPushListener()
    return subscribeForegroundPush((push) => {
      toast.info(`${push.title} — ${push.body}`, {
        onClick: () => {
          if (push.link) navigate(push.link)
        },
      })
    })
  }, [navigate])

  return null
}

export default GlobalPushListener
