import { api, type GenericResponse } from '../../Shared/api'

export interface MembershipOption {
  id: string
  option_text: string
  display_order: number
}

export interface MembershipQuestion {
  id: string
  question: string
  is_required: boolean
  display_order: number
  options: MembershipOption[]
}

export interface MembershipApplication {
  id: string
  user_name: string
  status: string
  score: number
  submitted_at: string
  reviewed_by?: string | null
  reviewed_at?: string | null
  decision_reason?: string | null
  created_at: string
  updated_at: string
}

export interface MembershipStatus {
  is_member: boolean
  application: MembershipApplication | null
}

export interface AnswerItem {
  question_id: string
  option_id: string
}

const BASE = '/api/v1/auth/membership'

export const getMembershipStatusAPI = async (): Promise<
  GenericResponse<MembershipStatus>
> => {
  const response = await api.get(`${BASE}/status`)
  return response.data
}

export const getMembershipQuestionsAPI = async (): Promise<
  GenericResponse<MembershipQuestion[]>
> => {
  const response = await api.get(`${BASE}/questions`)
  return response.data
}

export interface MembershipApplicationExtras {
  country_of_origin?: string
  state_of_origin?: string
  date_of_birth?: string
  current_country?: string
}

export const createMembershipApplicationAPI = async (
  phone_number?: string,
  extras?: MembershipApplicationExtras
): Promise<GenericResponse<MembershipApplication>> => {
  const response = await api.post(`${BASE}/applications`, {
    phone_number: phone_number ?? null,
    country_of_origin: extras?.country_of_origin ?? null,
    state_of_origin: extras?.state_of_origin ?? null,
    date_of_birth: extras?.date_of_birth ?? null,
    current_country: extras?.current_country ?? null,
  })
  return response.data
}

export const getMyMembershipApplicationAPI = async (): Promise<
  GenericResponse<MembershipApplication | null>
> => {
  const response = await api.get(`${BASE}/my_application`)
  return response.data
}

// Sends ALL answers at once (batch). The backend replaces the
// application's answers with the submitted list.
export const submitMembershipAnswersAPI = async (
  applicationId: string,
  answers: AnswerItem[]
): Promise<GenericResponse<MembershipApplication>> => {
  const response = await api.post(
    `${BASE}/applications/${applicationId}/answers`,
    { answers }
  )
  return response.data
}
