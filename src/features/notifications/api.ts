import { api, type GenericResponse } from '../../Shared/api'

export type NotificationKind =
  | 'comment'
  | 'like'
  | 'poll_vote'
  | 'friend_request'
  | 'friend_accepted'

export interface AppNotification {
  id: string
  user_name: string
  kind: string
  title: string
  body: string
  link?: string | null
  is_read: boolean
  created_at: string
}

export interface UnreadCount {
  count: number
}

export const listNotifications = async (
  limit = 20,
  offset = 0,
): Promise<GenericResponse<AppNotification[]>> => {
  const response = await api.get('/api/v1/auth/notification/list', {
    params: { limit, offset },
  })
  return response.data
}

export const getUnreadCount = async (): Promise<GenericResponse<UnreadCount>> => {
  const response = await api.get('/api/v1/auth/notification/unread_count')
  return response.data
}

export const markNotificationsRead = async (
  ids?: string[],
): Promise<GenericResponse<string>> => {
  const response = await api.post('/api/v1/auth/notification/read', {
    ids: ids ?? null,
  })
  return response.data
}

export const registerPushToken = async (
  token: string,
): Promise<GenericResponse<{ saved: boolean }>> => {
  const response = await api.post('/api/v1/auth/notification/register_token', {
    token,
  })
  return response.data
}
