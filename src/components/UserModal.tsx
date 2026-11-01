import { useEffect, useRef } from 'react'
import type { User } from '../types/user'

interface UserModalProps {
    user: User
    onClose: () => void
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
            className="m-auto w-[calc(100%-2rem)] max-w-md border border-neutral-300 bg-white p-0 text-neutral-900 backdrop:bg-black/40"
        >
            <div className="p-6">
                <h2 id="user-modal-title" className="text-lg font-semibold">
                    {user.name}
                </h2>
                <p className="text-sm text-neutral-500">@{user.username}</p>

                <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
                    <dt className="text-neutral-500">Email</dt>
                    <dd className="break-words">{user.email}</dd>
                    <dt className="text-neutral-500">Telepon</dt>
                    <dd>{user.phone}</dd>
                    <dt className="text-neutral-500">Website</dt>
                    <dd>{user.website}</dd>
                    <dt className="text-neutral-500">Alamat</dt>
                    <dd>
                        {address.street}, {address.suite}, {address.city} {address.zipcode}
                    </dd>
                    <dt className="text-neutral-500">Perusahaan</dt>
                    <dd>{company.name}</dd>
                </dl>

                <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    className="mt-6 text-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                    Tutup
                </button>
            </div>
        </dialog>
    )
}