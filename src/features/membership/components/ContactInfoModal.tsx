import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../../../Shared/components/modal.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import AppInput from '../../../Shared/components/AppInput.tsx'
import {
  DIAL_CODES,
  detectCountryIso,
  dialCodeForIso,
} from '../membershipUtils.ts'

export interface ContactInfo {
  phone_number: string
  country_of_origin: string
  state_of_origin: string
  date_of_birth: string
  current_country: string
}

interface ContactInfoModalProps {
  isOpen: boolean
  initial: Partial<ContactInfo>
  saving: boolean
  onSave: (info: ContactInfo) => void
}

// Split an existing "+<dial><number>" into its parts.
const splitPhone = (phone: string | undefined): { dial: string; number: string } => {
  const detected = detectCountryIso()
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    const match = DIAL_CODES.filter((d) => digits.startsWith(d.dial)).sort(
      (a, b) => b.dial.length - a.dial.length
    )[0]
    if (match) return { dial: match.dial, number: digits.slice(match.dial.length) }
    return { dial: dialCodeForIso(detected), number: digits }
  }
  return { dial: dialCodeForIso(detected), number: '' }
}

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  isOpen,
  initial,
  saving,
  onSave,
}) => {
  const [dial, setDial] = useState(() => splitPhone(initial.phone_number).dial)
  const [number, setNumber] = useState(
    () => splitPhone(initial.phone_number).number
  )
  const [country, setCountry] = useState(
    () =>
      initial.country_of_origin ??
      DIAL_CODES.find((d) => d.iso === detectCountryIso())?.name ??
      ''
  )
  const [stateOfOrigin, setStateOfOrigin] = useState(
    () => initial.state_of_origin ?? ''
  )
  const [dob, setDob] = useState(() => initial.date_of_birth ?? '')

  useEffect(() => {
    if (!isOpen) return
    const parts = splitPhone(initial.phone_number)
    setDial(parts.dial)
    setNumber(parts.number)
    setCountry(
      initial.country_of_origin ??
        DIAL_CODES.find((d) => d.iso === detectCountryIso())?.name ??
        ''
    )
    setStateOfOrigin(initial.state_of_origin ?? '')
    setDob(initial.date_of_birth ?? '')
  }, [isOpen, initial])

  const handleSave = () => {
    const digits = number.replace(/\D/g, '')
    if (digits.length < 4 || digits.length > 15) {
      toast.error('Enter a valid phone number.')
      return
    }
    if (!country.trim()) {
      toast.error('Select your country of origin.')
      return
    }
    if (!stateOfOrigin.trim()) {
      toast.error('Enter your state of origin.')
      return
    }
    if (!dob) {
      toast.error('Enter your date of birth.')
      return
    }
    // Current country is auto-detected in the background, never asked.
    const currentCountry =
      initial.current_country ??
      DIAL_CODES.find((d) => d.iso === detectCountryIso())?.name ??
      ''
    onSave({
      phone_number: `+${dial}${digits}`,
      country_of_origin: country.trim(),
      state_of_origin: stateOfOrigin.trim(),
      date_of_birth: dob,
      current_country: currentCountry,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Your details"
      closeOnOutsideClick={false}
    >
      <p className="text-sm text-[#4d5666]">
        We need a few details to complete your membership application.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-[#0A1931]">
            Phone number
          </label>
          <div className="flex gap-2">
            <select
              value={dial}
              onChange={(event) => setDial(event.target.value)}
              className="w-28 shrink-0 border border-[#0A1931]/25 bg-white px-2 py-2 text-[15px] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
              aria-label="Country code"
            >
              {DIAL_CODES.map((d) => (
                <option key={`${d.iso}-${d.dial}`} value={d.dial}>
                  {d.iso} +{d.dial}
                </option>
              ))}
            </select>
            <input
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              placeholder="8012345678"
              inputMode="tel"
              className="min-w-0 flex-1 border border-[#0A1931]/25 bg-white px-4 py-2 text-[15px] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-[#0A1931]">
            Country of origin
          </label>
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full border border-[#0A1931]/25 bg-white px-4 py-2 text-[15px] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
          >
            <option value="">Select country</option>
            {DIAL_CODES.map((d) => (
              <option key={d.iso} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <AppInput
          label="State of origin"
          value={stateOfOrigin}
          onChange={(event) => setStateOfOrigin(event.target.value)}
          placeholder="Your state of origin"
        />
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-[#0A1931]">
            Date of birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            className="w-full border border-[#0A1931]/25 bg-white px-4 py-2 text-[15px] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
          />
        </div>
        <AppButton fullWidth loading={saving} onClick={handleSave}>
          Save and continue
        </AppButton>
      </div>
    </Modal>
  )
}

export default ContactInfoModal
