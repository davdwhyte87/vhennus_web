import { api, type GenericResponse } from '../../Shared/api'
import type { MembershipApplication } from '../membership/api'

export interface AdminUserRow {
  user_name: string
  name: string | null
  email: string | null
  membership: boolean
  phone_number: string | null
  created_at: string
}

export interface AdminStats {
  total_users: number
  total_members: number
}

export interface ApplicationWithContact extends MembershipApplication {
  email: string | null
  phone_number: string | null
  country_of_origin: string | null
  state_of_origin: string | null
  date_of_birth: string | null
  current_country: string | null
}

export interface AdminAnswerView {
  question_id: string
  question: string
  is_required: boolean
  option_id: string | null
  option_text: string | null
  is_correct: boolean | null
}

export interface AdminApplicationDetail {
  application: ApplicationWithContact
  total_questions: number
  answers: AdminAnswerView[]
}

export interface AdminOptionInput {
  option_text: string
  is_correct?: boolean
  display_order?: number
}

export interface AdminOptionView {
  id: string
  option_text: string
  is_correct: boolean
  display_order: number
}

export interface AdminQuestionView {
  id: string
  question: string
  is_required: boolean
  display_order: number
  created_at: string
  options: AdminOptionView[]
}

const BASE = '/api/v1/auth/admin/membership'

export const getAdminStatsAPI = async (): Promise<
  GenericResponse<AdminStats>
> => {
  const response = await api.get(`${BASE}/stats`)
  return response.data
}

export const getAdminUsersAPI = async (): Promise<
  GenericResponse<AdminUserRow[]>
> => {
  const response = await api.get(`${BASE}/users`)
  return response.data
}

export const getAdminApplicationsAPI = async (
  status?: string
): Promise<GenericResponse<ApplicationWithContact[]>> => {
  const response = await api.get(`${BASE}/applications`, {
    params: status ? { status } : {},
  })
  return response.data
}

export const getAdminApplicationAPI = async (
  id: string
): Promise<GenericResponse<AdminApplicationDetail>> => {
  const response = await api.get(`${BASE}/applications/${id}`)
  return response.data
}

export const takeUnderReviewAPI = async (
  id: string
): Promise<GenericResponse<string | null>> => {
  const response = await api.post(`${BASE}/applications/${id}/review`)
  return response.data
}

export const approveApplicationAPI = async (
  id: string,
  reason?: string
): Promise<GenericResponse<string | null>> => {
  const response = await api.post(`${BASE}/applications/${id}/approve`, {
    reason: reason ?? null,
  })
  return response.data
}

export const rejectApplicationAPI = async (
  id: string,
  reason?: string
): Promise<GenericResponse<string | null>> => {
  const response = await api.post(`${BASE}/applications/${id}/reject`, {
    reason: reason ?? null,
  })
  return response.data
}

export interface MembershipSettings {
  applications_paused: boolean
}

export const getMembershipSettingsAPI = async (): Promise<
  GenericResponse<MembershipSettings>
> => {
  const response = await api.get(`${BASE}/settings`)
  return response.data
}

export const updateMembershipSettingsAPI = async (
  applications_paused: boolean
): Promise<GenericResponse<MembershipSettings>> => {
  const response = await api.put(`${BASE}/settings`, { applications_paused })
  return response.data
}

export const getAdminQuestionsAPI = async (): Promise<
  GenericResponse<AdminQuestionView[]>
> => {
  const response = await api.get(`${BASE}/questions`)
  return response.data
}

export const createAdminQuestionAPI = async (data: {
  question: string
  is_required?: boolean
  display_order?: number
  options: AdminOptionInput[]
}): Promise<GenericResponse<AdminQuestionView>> => {
  const response = await api.post(`${BASE}/questions`, data)
  return response.data
}

export const updateAdminQuestionAPI = async (
  id: string,
  data: {
    question?: string
    is_required?: boolean
    display_order?: number
    options?: AdminOptionInput[]
  }
): Promise<GenericResponse<AdminQuestionView>> => {
  const response = await api.put(`${BASE}/questions/${id}`, data)
  return response.data
}

export const deleteAdminQuestionAPI = async (
  id: string
): Promise<GenericResponse<string | null>> => {
  const response = await api.delete(`${BASE}/questions/${id}`)
  return response.data
}

// ---------- Skills & interests (search settings) ----------

export interface SearchTag {
  id: string
  name: string
  kind: 'skill' | 'interest'
  created_at: string
  updated_at: string
}

const SEARCH_BASE = '/api/v1/auth/admin/search'

export const getAdminSearchTagsAPI = async (): Promise<
  GenericResponse<SearchTag[]>
> => {
  const response = await api.get(`${SEARCH_BASE}/tags`)
  return response.data
}

export const createAdminSearchTagAPI = async (data: {
  name: string
  kind: 'skill' | 'interest'
}): Promise<GenericResponse<SearchTag>> => {
  const response = await api.post(`${SEARCH_BASE}/tags`, data)
  return response.data
}

export const updateAdminSearchTagAPI = async (
  id: string,
  data: { name?: string; kind?: 'skill' | 'interest' }
): Promise<GenericResponse<SearchTag>> => {
  const response = await api.put(`${SEARCH_BASE}/tags/${id}`, data)
  return response.data
}

export const deleteAdminSearchTagAPI = async (
  id: string
): Promise<GenericResponse<string | null>> => {
  const response = await api.delete(`${SEARCH_BASE}/tags/${id}`)
  return response.data
}

// ---------- Mass notifications (broadcast to all users) ----------

export interface BroadcastReq {
  title: string
  body: string
  link?: string | null
}

export interface BroadcastResp {
  users_notified: number
  pushes_sent: number
}

const NOTIF_BASE = '/api/v1/auth/admin/notifications'

export const sendBroadcastAPI = async (
  data: BroadcastReq
): Promise<GenericResponse<BroadcastResp>> => {
  const response = await api.post(`${NOTIF_BASE}/broadcast`, {
    title: data.title,
    body: data.body,
    link: data.link ?? null,
  })
  return response.data
}

export interface PushStatus {
  total_users: number
  users_with_tokens: number
}

export const getPushStatusAPI = async (): Promise<
  GenericResponse<PushStatus>
> => {
  const response = await api.get(`${NOTIF_BASE}/status`)
  return response.data
}

export interface TestPushResp {
  stored: boolean
  has_token: boolean
  push_sent: boolean
}

export const sendTestPushAPI = async (
  userName: string,
): Promise<GenericResponse<TestPushResp>> => {
  const response = await api.post(`${NOTIF_BASE}/test`, {
    user_name: userName,
    title: 'Test notification',
    body: 'If you see this, push works on this device.',
  })
  return response.data
}

export const startHeartbeatAPI = async (
  userName: string,
  count = 10,
): Promise<GenericResponse<string>> => {
  const response = await api.post(`${NOTIF_BASE}/heartbeat`, {
    user_name: userName,
    count,
  })
  return response.data
}
