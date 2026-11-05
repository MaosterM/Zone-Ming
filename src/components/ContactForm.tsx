import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'

type Status = 'idle' | 'sending' | 'sent' | 'opened' | 'failed'

const statusMessages: Record<Status, string> = {
  idle: '',
  sending: 'Sending your message.',
  sent: 'Message sent. Thank you.',
  opened: 'Your email app should now be open with this message ready to send.',
  failed: `That did not send. Please email ${profile.email} instead.`,
}

function openEmailApp(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Message from ${name}`)
  const body = encodeURIComponent(`${message}\n\n${name}\n${email}`)
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
}

/** Sends through Formspree when an endpoint is set in the profile, otherwise opens an email. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (!profile.formspreeEndpoint) {
      openEmailApp(String(data.get('name')), String(data.get('email')), String(data.get('message')))
      setStatus('opened')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(profile.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(`Formspree answered ${response.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" rows={5} required />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary">
          Send message
        </button>
        <p role="status" className="text-halo text-base text-ink">
          {statusMessages[status]}
        </p>
      </div>
    </form>
  )
}
