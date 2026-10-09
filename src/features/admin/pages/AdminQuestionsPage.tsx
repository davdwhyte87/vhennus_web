import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import AppCard from '../../../Shared/components/AppCard.tsx'
import AppButton from '../../../Shared/components/Button.tsx'
import Modal from '../../../Shared/components/modal.tsx'
import PageHeader from '../../../Shared/components/PageHeader.tsx'
import {
  createAdminQuestionAPI,
  deleteAdminQuestionAPI,
  getAdminQuestionsAPI,
  updateAdminQuestionAPI,
  type AdminOptionInput,
  type AdminQuestionView,
} from '../api.tsx'

interface OptionDraft {
  option_text: string
  is_correct: boolean
}

const emptyForm = () => ({
  question: '',
  options: [
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
  ] as OptionDraft[],
})

const AdminQuestionsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<AdminQuestionView[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminQuestionView | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const reload = async () => {
    setLoading(true)
    try {
      const result = await getAdminQuestionsAPI()
      setQuestions(result.data ?? [])
    } catch {
      toast.error('Unable to load membership questions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (question: AdminQuestionView) => {
    setEditing(question)
    setForm({
      question: question.question,
      options: question.options.map((o) => ({
        option_text: o.option_text,
        is_correct: o.is_correct,
      })),
    })
    setModalOpen(true)
  }

  const setOption = (index: number, patch: Partial<OptionDraft>) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, ...patch } : opt
      ),
    }))
  }

  const markCorrect = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      })),
    }))
  }

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { option_text: '', is_correct: false }],
    }))
  }

  const removeOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    if (!form.question.trim()) {
      toast.error('Question text is required.')
      return
    }
    const options: AdminOptionInput[] = form.options.map((opt, i) => ({
      option_text: opt.option_text.trim(),
      is_correct: opt.is_correct,
      display_order: i,
    }))
    if (options.some((o) => !o.option_text)) {
      toast.error('All options need text.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateAdminQuestionAPI(editing.id, {
          question: form.question.trim(),
          options,
        })
        toast.success('Question updated.')
      } else {
        await createAdminQuestionAPI({
          question: form.question.trim(),
          options,
        })
        toast.success('Question added.')
      }
      setModalOpen(false)
      await reload()
    } catch {
      toast.error('Unable to save question. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this question and all its answers?')) return
    setDeletingId(id)
    try {
      await deleteAdminQuestionAPI(id)
      toast.success('Question deleted.')
      await reload()
    } catch {
      toast.error('Unable to delete question.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Questions"
        description="Manage the membership application questions."
      />

      <AppButton className="mt-6" onClick={openAdd}>
        <Plus className="h-5 w-5" />
        Add question
      </AppButton>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#4d5666]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading questions…
        </div>
      ) : questions.length === 0 ? (
        <AppCard className="mt-4 p-6 text-center text-[#4d5666]">
          No questions yet. Add the first one.
        </AppCard>
      ) : (
        <div className="mt-4 space-y-3">
          {questions.map((question, qi) => (
            <AppCard key={question.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-pre-wrap break-words text-left font-medium text-[#0A1931]">
                  <span className="mr-2 font-mono text-xs text-[#CC5A2A]">
                    {qi + 1}
                  </span>
                  {question.question}
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(question)}
                    className="rounded-md p-1.5 hover:bg-[#0A1931]/5"
                    aria-label="Edit question"
                  >
                    <Pencil className="h-4 w-4 text-[#0A1931]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(question.id)}
                    disabled={deletingId === question.id}
                    className="rounded-md p-1.5 hover:bg-red-50"
                    aria-label="Delete question"
                  >
                    {deletingId === question.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#CC5A2A]" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-[#CC5A2A]" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {question.options.map((option) => (
                  <p
                    key={option.id}
                    className="flex items-start gap-2 text-left text-sm text-[#4d5666]"
                  >
                    {option.is_correct ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-[#4d5666]/40" />
                    )}
                    <span className="whitespace-pre-wrap break-words text-left">
                      {option.option_text}
                    </span>
                    {option.is_correct && (
                      <span className="text-xs font-medium text-green-600">
                        Correct
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </AppCard>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit question' : 'Add question'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-left text-sm font-medium text-[#0A1931]">
              Question
            </label>
            <textarea
              value={form.question}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, question: event.target.value }))
              }
              placeholder="Enter the full question text"
              rows={4}
              className="block min-h-[7rem] w-full border border-[#C9A86A]/60 bg-white px-3 py-2 text-[15px] leading-[1.7] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
            />
          </div>
          <div>
            <p className="mb-2 text-left text-sm font-medium text-[#0A1931]">
              Options (select the correct one)
            </p>
            <div className="space-y-2">
              {form.options.map((option, i) => (
                <div key={i} className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => markCorrect(i)}
                    className="shrink-0 rounded-full p-1 pt-2.5"
                    aria-label={`Mark option ${i + 1} as correct`}
                  >
                    {option.is_correct ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <span className="block h-5 w-5 rounded-full border border-[#4d5666]/40" />
                    )}
                  </button>
                  <textarea
                    value={option.option_text}
                    onChange={(event) =>
                      setOption(i, { option_text: event.target.value })
                    }
                    placeholder={`Option ${i + 1}`}
                    rows={2}
                    className="block min-h-[3rem] w-full min-w-0 flex-1 border border-[#C9A86A]/60 bg-white px-3 py-2 text-[15px] leading-[1.6] text-[#0A1931] focus:border-[#CC5A2A] focus:outline-none"
                  />
                  {form.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="shrink-0 rounded-md p-1.5 pt-2.5 hover:bg-red-50"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-[#CC5A2A]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm font-medium text-[#CC5A2A] hover:text-[#0A1931]"
            >
              + Add option
            </button>
          </div>
          <AppButton fullWidth loading={saving} onClick={handleSave}>
            {editing ? 'Save changes' : 'Add question'}
          </AppButton>
        </div>
      </Modal>
    </div>
  )
}

export default AdminQuestionsPage
