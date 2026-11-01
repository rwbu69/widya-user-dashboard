import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'
import { getInitials } from '../utils/getInitials'

interface UserModalProps {
  user: User
  onClose: () => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-slate-700">{children}</div>
    </section>
  )
}

export function UserModal({ user, onClose }: UserModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const { address, company } = user

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close()
      }}
      aria-labelledby="user-modal-title"
      className="m-auto w-full max-w-lg rounded-2xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/60"
    >
      <div className="space-y-6 p-6">
        <header className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700"
          >
            {getInitials(user.name)}
          </span>
          <div>
            <h2 id="user-modal-title" className="text-xl font-bold">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500">@{user.username}</p>
          </div>
        </header>

        <Section title="Kontak">
          <p>
            Email:{' '}
            <a className="text-indigo-600 hover:underline" href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </p>
          <p>Telepon: {user.phone}</p>
          <p>
            Website:{' '}
            <a
              className="text-indigo-600 hover:underline"
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website}
            </a>
          </p>
        </Section>

        <Section title="Alamat">
          <p>
            {address.street}, {address.suite}
          </p>
          <p>
            {address.city} {address.zipcode}
          </p>
        </Section>

        <Section title="Perusahaan">
          <p className="font-medium">{company.name}</p>
          <p className="italic">“{company.catchPhrase}”</p>
          <p className="text-slate-500">{company.bs}</p>
        </Section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </dialog>
  )
}