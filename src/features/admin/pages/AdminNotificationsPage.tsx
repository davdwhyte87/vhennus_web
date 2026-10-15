import { useEffect, useState } from 'react'
import { BellRing, Megaphone, Send, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import Modal from '../../../Shared/components/modal.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  getAdminStatsAPI,
  getPushStatusAPI,
  sendBroadcastAPI,
  sendTestPushAPI,
  type BroadcastResp,
  type PushStatus,
  type TestPushResp,
} from '../api.tsx'

const TITLE_MAX = 140
const BODY_MAX = 500

const AdminNotificationsPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [link, setLink] = useState('')
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [pushStatus, setPushStatus] = useState<PushStatus | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<BroadcastResp | null>(null)
  const [testUser, setTestUser] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestPushResp | null>(null)

  useEffect(() => {
    getAdminStatsAPI()
      .then((result) => setTotalUsers(result.data?.total_users ?? null))
      .catch(() => setTotalUsers(null))
    getPushStatusAPI()
      .then((result) => setPushStatus(result.data ?? null))
      .catch(() => setPushStatus(null))
  }, [])

  const valid =
    title.trim().length > 0 &&
    title.trim().length <= TITLE_MAX &&
    body.trim().length > 0 &&
    body.trim().length <= BODY_MAX

  const handleTestPush = async () => {
    if (testUser.trim() === '' || testing) return
    setTesting(true)
    setTestResult(null)
    try {
      const result = await sendTestPushAPI(testUser.trim())
      setTestResult(result.data)
      toast.info(result.message || 'Test sent.')
    } catch (err) {
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message
      toast.error(
        serverMessage && serverMessage.trim() !== ''
          ? serverMessage
          : 'Could not send test push.',
      )
    } finally {
      setTesting(false)
    }
  }

  const handleConfirmSend = async () => {    if (!valid || sending) return
    setSending(true)
    try {
      const result = await sendBroadcastAPI({
        title: title.trim(),
        body: body.trim(),
        link: link.trim() === '' ? null : link.trim(),
      })
      setLastResult(result.data)
      toast.success(
        result.message || `Sent to ${result.data.users_notified} users.`,
      )
      getPushStatusAPI()
        .then((status) => setPushStatus(status.data ?? null))
        .catch(() => {})
      setTitle('')
      setBody('')
      setLink('')
      setConfirmOpen(false)
    } catch (err) {
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message
      toast.error(
        serverMessage && serverMessage.trim() !== ''
          ? serverMessage
          : 'Could not send broadcast.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send a mass notification to every user"
      />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Composer */}
        <AppCard className="p-5 lg:col-span-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center bg-[#0A1931] text-[#C9A86A]">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-[#0A1931]">Broadcast</h2>
              <p className="flex items-center gap-1 text-xs text-[#4d5666]">
                <Users className="h-3 w-3" />
                {totalUsers === null
                  ? 'Reaches every user'
                  : `Reaches all ${totalUsers} user${totalUsers === 1 ? '' : 's'}`}
              </p>
              <p className="mt-1 text-xs font-medium text-[#4d5666]">
                {pushStatus === null ? (
                  'Checking push reach…'
                ) : pushStatus.users_with_tokens === 0 ? (
                  <span className="text-[#CC5A2A]">
                    Push reach: 0 devices — no one has enabled push yet. Users
                    enable it in the installed app → Notifications.
                  </span>
                ) : (
                  <span className="text-green-700">
                    Push reach: {pushStatus.users_with_tokens} of{' '}
                    {pushStatus.total_users} devices
                  </span>
                )}
              </p>
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-1 flex items-center justify-between text-sm font-medium text-[#0A1931]">
              Title
              <span className="text-xs font-normal text-[#4d5666]">
                {title.length}/{TITLE_MAX}
              </span>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New feature is live"
              maxLength={TITLE_MAX}
              className="w-full border border-[#C9A86A]/60 bg-white px-3 py-2.5 text-sm text-[#0A1931] placeholder:text-gray-400 focus:border-[#CC5A2A] focus:outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 flex items-center justify-between text-sm font-medium text-[#0A1931]">
              Message
              <span className="text-xs font-normal text-[#4d5666]">
                {body.length}/{BODY_MAX}
              </span>
            </span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type the notification text every user will receive…"
              rows={5}
              maxLength={BODY_MAX}
              className="w-full resize-none border border-[#C9A86A]/60 bg-white px-3 py-2.5 text-sm leading-relaxed text-[#0A1931] placeholder:text-gray-400 focus:border-[#CC5A2A] focus:outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-[#0A1931]">
              Link <span className="font-normal text-[#4d5666]">(optional)</span>
            </span>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /home/feeds"
              className="w-full border border-[#C9A86A]/60 bg-white px-3 py-2.5 text-sm text-[#0A1931] placeholder:text-gray-400 focus:border-[#CC5A2A] focus:outline-none"
            />
            <span className="mt-1 block text-xs text-[#4d5666]">
              Where tapping the notification takes the user.
            </span>
          </label>

          <AppButton
            fullWidth
            disabled={!valid || sending}
            loading={sending}
            onClick={() => setConfirmOpen(true)}
            className="mt-5"
          >
            <Send className="h-4 w-4" />
            Send to everyone
          </AppButton>
        </AppCard>

        {/* Preview + last result */}
        <div className="space-y-4 lg:col-span-2">
          <AppCard className="p-5">
            <h2 className="text-sm font-semibold text-[#0A1931]">
              How users will see it
            </h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#E8E0CF]">
              <div className="flex items-center gap-2 bg-[#0A1931] px-4 py-2.5 text-white">
                <BellRing className="h-4 w-4 text-[#C9A86A]" />
                <span className="text-xs font-semibold">Vhennus • now</span>
              </div>
              <div className="bg-white px-4 py-3">
                <p className="truncate text-sm font-bold text-[#0A1931]">
                  {title.trim() === '' ? 'Your title here' : title.trim()}
                </p>
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[#4d5666]">
                  {body.trim() === ''
                    ? 'Your message text will appear here, in the inbox and as a push notification.'
                    : body.trim()}
                </p>
              </div>
            </div>
          </AppCard>

          {lastResult && (
            <AppCard className="border-green-200 bg-green-50 p-5">
              <h2 className="text-sm font-semibold text-green-900">
                Last broadcast delivered
              </h2>
              <p className="mt-1 text-sm text-green-800">
                {lastResult.users_notified} inbox
                {lastResult.users_notified === 1 ? '' : 'es'} •{' '}
                {lastResult.pushes_sent} push
                {lastResult.pushes_sent === 1 ? '' : 'es'}
              </p>
            </AppCard>
          )}

          <AppCard className="p-5">
            <h2 className="text-sm font-semibold text-[#0A1931]">
              Send a test to one user
            </h2>
            <p className="mt-1 text-xs text-[#4d5666]">
              Debugging delivery? Fire a single test and watch that device.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                placeholder="user_name"
                className="min-w-0 flex-1 border border-[#C9A86A]/60 bg-white px-3 py-2.5 text-sm text-[#0A1931] placeholder:text-gray-400 focus:border-[#CC5A2A] focus:outline-none"
              />
              <AppButton
                size="sm"
                loading={testing}
                disabled={testUser.trim() === '' || testing}
                onClick={handleTestPush}
              >
                <Send className="h-4 w-4" />
                Test
              </AppButton>
            </div>
            {testResult && (
              <div className="mt-3 space-y-1 rounded-xl bg-[#F5F5F0] p-3 text-xs">
                <TestLine ok={testResult.stored} label="Inbox row stored" />
                <TestLine ok={testResult.has_token} label="Device token on file" />
                <TestLine ok={testResult.push_sent} label="FCM accepted the push" />
                {!testResult.has_token && (
                  <p className="pt-1 text-[#CC5A2A]">
                    No token — enable push inside that user's installed app first.
                  </p>
                )}
                {testResult.has_token && !testResult.push_sent && (
                  <p className="pt-1 text-[#CC5A2A]">
                    Token exists but FCM rejected it — check server logs.
                  </p>
                )}
              </div>
            )}
          </AppCard>
        </div>
      </div>

      <Modal
        isOpen={confirmOpen}
        onClose={() => !sending && setConfirmOpen(false)}
        title="Send broadcast?"
        size="sm"
      >
        <p className="text-sm leading-relaxed text-[#4d5666]">
          This will notify{' '}
          <span className="font-bold text-[#0A1931]">
            {totalUsers === null ? 'every user' : `all ${totalUsers} users`}
          </span>{' '}
          immediately, in-app and by push. This can't be undone.
        </p>
        <div className="mt-4 rounded-xl bg-[#F5F5F0] p-3">
          <p className="truncate text-sm font-bold text-[#0A1931]">
            {title.trim()}
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-[#4d5666]">
            {body.trim()}
          </p>
        </div>
        <div className="mt-5 flex gap-2">
          <AppButton
            variant="outline"
            fullWidth
            disabled={sending}
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </AppButton>
          <AppButton fullWidth loading={sending} onClick={handleConfirmSend}>
            <Send className="h-4 w-4" />
            Send now
          </AppButton>
        </div>
      </Modal>
    </div>
  )
}

export default AdminNotificationsPage

const TestLine: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <p className={ok ? 'text-green-700' : 'text-[#4d5666]'}>
    {ok ? '✓' : '○'} {label}
  </p>
)
