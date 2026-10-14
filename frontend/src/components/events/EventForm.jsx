import { useEffect, useRef, useState } from 'react'
import { EVENT_TYPES, REGISTRATION_TYPES } from '../../config/eventConstants'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  )
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      rows={4}
      className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  )
}

function Select({ options, className = '', ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

const EMPTY = {
  title: '', description: '', category: '', eventType: '', venue: '',
  date: '', startTime: '', endTime: '', registrationDeadline: '',
  expectedParticipants: '', maximumParticipants: '',
  registrationType: 'Free', rules: '',
}

/**
 * Shared event form used by CreateEvent and EditEvent pages.
 *
 * Props:
 *  - initial: initial field values (for edit mode)
 *  - onSubmit(formData, action): called with FormData + 'draft'|'submit'
 *  - loading: bool
 *  - errors: object { fieldName: message }
 *  - globalError: string
 */
export default function EventForm({ initial = {}, onSubmit, loading, errors = {}, globalError }) {
  const [fields, setFields] = useState({ ...EMPTY, ...initial })
  const [posterPreview, setPosterPreview] = useState(
    initial.poster ? `${API_URL}${initial.poster}` : null
  )
  const posterRef = useRef()

  useEffect(() => {
    setFields({ ...EMPTY, ...initial })
    setPosterPreview(initial.poster ? `${API_URL}${initial.poster}` : null)
  }, [initial.title]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (name) => (e) => setFields((f) => ({ ...f, [name]: e.target.value }))

  const handlePosterChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPosterPreview(URL.createObjectURL(file))
  }

  const buildFormData = (action) => {
    const fd = new FormData()
    Object.entries(fields).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
    fd.set('action', action)
    if (posterRef.current?.files[0]) fd.append('poster', posterRef.current.files[0])
    return fd
  }

  const handleAction = (action) => (e) => {
    e.preventDefault()
    onSubmit(buildFormData(action), action)
  }

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {globalError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {globalError}
        </div>
      )}

      {/* ── Basic Info ─────────────────────────────────────────────────── */}
      <Section title="Basic Information">
        <div className="sm:col-span-2">
          <Field label="Event Title" error={errors.title} required>
            <Input value={fields.title} onChange={set('title')} placeholder="e.g. Annual Science Fair" />
          </Field>
        </div>
        <Field label="Event Type" error={errors.eventType} required>
          <Select options={EVENT_TYPES} value={fields.eventType} onChange={set('eventType')} />
        </Field>
        <Field label="Category" error={errors.category}>
          <Input value={fields.category} onChange={set('category')} placeholder="e.g. Science, Technology" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description" error={errors.description} required>
            <Textarea value={fields.description} onChange={set('description')} placeholder="Describe the event…" />
          </Field>
        </div>
        <Field label="Venue" error={errors.venue}>
          <Input value={fields.venue} onChange={set('venue')} placeholder="Building / Room / Online link" />
        </Field>
      </Section>

      {/* ── Schedule ───────────────────────────────────────────────────── */}
      <Section title="Schedule">
        <Field label="Event Date" error={errors.date} required>
          <Input type="date" value={fields.date} onChange={set('date')} />
        </Field>
        <Field label="Registration Deadline" error={errors.registrationDeadline}>
          <Input type="date" value={fields.registrationDeadline} onChange={set('registrationDeadline')} />
        </Field>
        <Field label="Start Time" error={errors.startTime} required>
          <Input type="time" value={fields.startTime} onChange={set('startTime')} />
        </Field>
        <Field label="End Time" error={errors.endTime} required>
          <Input type="time" value={fields.endTime} onChange={set('endTime')} />
        </Field>
      </Section>

      {/* ── Registration ───────────────────────────────────────────────── */}
      <Section title="Registration">
        <Field label="Registration Type" error={errors.registrationType}>
          <Select options={REGISTRATION_TYPES} value={fields.registrationType} onChange={set('registrationType')} />
        </Field>
        <Field label="Expected Participants" error={errors.expectedParticipants}>
          <Input type="number" min={1} value={fields.expectedParticipants} onChange={set('expectedParticipants')} placeholder="e.g. 100" />
        </Field>
        <Field label="Maximum Participants" error={errors.maximumParticipants}>
          <Input type="number" min={1} value={fields.maximumParticipants} onChange={set('maximumParticipants')} placeholder="e.g. 150" />
        </Field>
      </Section>

      {/* ── Rules ─────────────────────────────────────────────────────── */}
      <Section title="Rules & Guidelines">
        <div className="sm:col-span-2">
          <Field label="Rules / Guidelines" error={errors.rules}>
            <Textarea rows={5} value={fields.rules} onChange={set('rules')} placeholder="List any rules or participation guidelines…" />
          </Field>
        </div>
      </Section>

      {/* ── Poster ────────────────────────────────────────────────────── */}
      <Section title="Event Poster">
        <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-start">
          {posterPreview && (
            <img src={posterPreview} alt="Poster preview" className="h-40 w-auto rounded-lg border border-slate-200 object-cover shadow-sm" />
          )}
          <div className="flex-1">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition">
              <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Click to upload poster</span>
              <span className="mt-1 text-xs">JPG, PNG or WEBP · max 5 MB</span>
              <input ref={posterRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePosterChange} />
            </label>
          </div>
        </div>
      </Section>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={handleAction('draft')}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={handleAction('submit')}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit for Approval'}
        </button>
      </div>
    </form>
  )
}
