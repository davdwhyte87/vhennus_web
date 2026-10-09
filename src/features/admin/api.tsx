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
