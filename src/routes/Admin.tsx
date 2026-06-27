import { AdminAuthGate } from '@/features/admin/AdminAuthGate'
import { AdminPanel } from '@/features/admin/AdminPanel'

export default function Admin() {
  return (
    <AdminAuthGate>
      <AdminPanel />
    </AdminAuthGate>
  )
}
