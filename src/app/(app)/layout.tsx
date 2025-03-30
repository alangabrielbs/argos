import { Header } from '@/components/header'
import { ModalProvider } from '@/components/modals/modal-provider'
import { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <Header />

      {children}
    </ModalProvider>
  )
}
