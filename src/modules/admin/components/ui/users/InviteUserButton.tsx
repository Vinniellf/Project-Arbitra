import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import InviteUserModal from './InviteUserModal'

type InviteUserButtonProps = {
  onUserInvited?: () => Promise<void> | void
}

export default function InviteUserButton({
  onUserInvited,
}: InviteUserButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
      >
        <UserPlus className="h-4 w-4" />
        Invitar usuario
      </button>

      <InviteUserModal
        open={open}
        onClose={() => setOpen(false)}
        onUserInvited={onUserInvited}
      />
    </>
  )
}
