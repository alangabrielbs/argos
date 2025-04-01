'use client'

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import Link from 'next/link'
import { useModal } from './modals/modal-provider'
import { Button } from './ui/button'

export const Header = () => {
  const { setShowNewSimulationModal } = useModal()

  useKeyboardShortcut('s', () => setShowNewSimulationModal(true))

  return (
    <header>
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link href="/">
          <span className="font-semibold">ARGOS</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-x-6">
            <li>
              <Link
                href="/kpis"
                className="hover:underline text-muted-foreground font-medium text-sm"
              >
                KPI's
              </Link>
            </li>
            <li>
              <Link
                href="/simulacoes"
                className="hover:underline text-muted-foreground font-medium text-sm"
              >
                Simulações
              </Link>
            </li>
            <li>
              <Button
                text="Nova simulação"
                variant="secondary"
                onClick={() => {
                  setShowNewSimulationModal(true)
                }}
                shortcut="S"
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
