import { api, type GenericResponse } from '../../Shared/api'

export interface GroupTopic {
  id: string
  group_id: string
  title: string
  is_open: boolean
  created_by: string
  created_at: string
  closed_at?: string | null
}

export interface GroupReplyPreview {
  id: string
  sender: string
  sender_name?: string | null
  text: string
}

export interface GroupMessage {
  id: string
  group_id: string
  sender: string
  sender_name?: string | null
  sender_image?: string | null
  text: string
  image?: string | null
  topic_id?: string | null
  reply_to_msg_id?: string | null
  reply_to?: GroupReplyPreview | null
  created_at: string
}

export interface GroupDetail {
  id: string
  name: string
  about?: string | null
  image?: string | null
  is_private: boolean
  owner: string
  invite_code?: string | null
  categories: string[]
  member_count: number
  is_member: boolean
  my_role?: string | null
  open_topic?: GroupTopic | null
  created_at: string
  updated_at: string
}

export interface MyGroupItem extends GroupDetail {
  unread_count: number
  last_message?: GroupMessage | null
}

export interface GroupMember {
  user_name: string
  role: string
  joined_at: string
  profile?: { user_name: string; image?: string | null; bio?: string | null; name?: string | null } | null
}

export interface JoinRequest {
  id: string
  group_id: string
  user_name: string
  status: string
  created_at: string
  profile?: GroupMember['profile']
}

export interface GroupUnread {
  total: number
  groups: { group_id: string; unread: number }[]
}

export interface GroupCategory {
  id: string
  name: string
}

const BASE = '/api/v1/auth/group'

export const createGroupAPI = async (data: {
  name: string
  about?: string
  image?: string
  is_private: boolean
  categories: string[]
}): Promise<GenericResponse<{ id: string }>> => {
  const res = await api.post(`${BASE}/create`, data)
  return res.data
}

export const updateGroupAPI = async (
  id: string,
  data: { name?: string; about?: string; image?: string; is_private?: boolean; categories?: string[] },
): Promise<GenericResponse<{ ok: boolean }>> => {
  const res = await api.patch(`${BASE}/${id}`, data)
  return res.data
}

export const getMyGroupsAPI = async (): Promise<GenericResponse<MyGroupItem[]>> => {
  const res = await api.get(`${BASE}/my`)
  return res.data
}

export const searchGroupsAPI = async (params: {
  q?: string
  category?: string
  limit?: number
  offset?: number
}): Promise<GenericResponse<GroupDetail[]>> => {
  const res = await api.get(`${BASE}/search`, { params })
  return res.data
}

export const invitePreviewAPI = async (code: string): Promise<GenericResponse<GroupDetail>> => {
  const res = await api.get(`${BASE}/invite/${code}`)
  return res.data
}

export const getGroupAPI = async (id: string): Promise<GenericResponse<GroupDetail>> => {
  const res = await api.get(`${BASE}/${id}`)
  return res.data
}

export const getGroupMembersAPI = async (id: string): Promise<GenericResponse<GroupMember[]>> => {
  const res = await api.get(`${BASE}/${id}/members`)
  return res.data
}

export const removeMemberAPI = async (id: string, user: string) => {
  const res = await api.delete(`${BASE}/${id}/members/${user}`)
  return res.data
}

export const joinGroupAPI = async (id: string): Promise<GenericResponse<{ status: string }>> => {
  const res = await api.post(`${BASE}/${id}/join`)
  return res.data
}

export const listJoinRequestsAPI = async (id: string): Promise<GenericResponse<JoinRequest[]>> => {
  const res = await api.get(`${BASE}/${id}/requests`, { params: { status: 'pending' } })
  return res.data
}

export const respondJoinAPI = async (id: string, reqId: string, action: 'accept' | 'reject') => {
  const res = await api.post(`${BASE}/${id}/requests/${reqId}`, { action })
  return res.data
}

export const addTopicAPI = async (id: string, title: string): Promise<GenericResponse<GroupTopic>> => {
  const res = await api.post(`${BASE}/${id}/topics`, { title })
  return res.data
}

export const closeTopicAPI = async (id: string, topicId: string) => {
  const res = await api.post(`${BASE}/${id}/topics/${topicId}/close`)
  return res.data
}

export const getGroupMessagesAPI = async (
  id: string,
  params?: { limit?: number; before?: string },
): Promise<GenericResponse<GroupMessage[]>> => {
  const res = await api.get(`${BASE}/${id}/messages`, { params })
  return res.data
}

export const markGroupReadAPI = async (id: string, lastMsgId?: string) => {
  const res = await api.post(`${BASE}/${id}/read`, { last_msg_id: lastMsgId ?? null })
  return res.data
}

export const getGroupUnreadAPI = async (): Promise<GenericResponse<GroupUnread>> => {
  const res = await api.get(`${BASE}/unread`)
  return res.data
}

export const listGroupCategoriesAPI = async (): Promise<GenericResponse<GroupCategory[]>> => {
  const res = await api.get(`${BASE}/categories`)
  return res.data
}

// ---- admin ----
export const adminListGroupsAPI = async (limit = 20, offset = 0) => {
  const res = await api.get(`${BASE}/admin/groups`, { params: { limit, offset } })
  return res.data
}

export const adminAddCategoryAPI = async (name: string): Promise<GenericResponse<GroupCategory>> => {
  const res = await api.post(`${BASE}/admin/categories`, { name })
  return res.data
}

export const adminDeleteCategoryAPI = async (id: string) => {
  const res = await api.delete(`${BASE}/admin/categories/${id}`)
  return res.data
}
