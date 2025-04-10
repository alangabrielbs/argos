'use client'

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useModal } from './modals/modal-provider'
import { Button } from './ui/button'

export const Header = () => {
  const { setShowNewSimulationModal } = useModal()
  const { slug } = useParams() as { slug?: string }

  useKeyboardShortcut('s', () => setShowNewSimulationModal(true))

  return (
    <header>
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link href={`/${slug}`}>
          <span className="font-semibold">ARGOS</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-x-6">
            <li>
              <Link
                href={`/${slug}/kpis`}
                className="hover:underline text-muted-foreground font-medium text-sm"
              >
                KPI's
              </Link>
            </li>
            <li>
              <Link
                href={`/${slug}/simulacoes`}
                className="hover:underline text-muted-foreground font-medium text-sm"
              >
                Simulações
              </Link>
            </li>
            <li>
              <Link
                href={`/${slug}/configuracoes`}
                className="hover:underline text-muted-foreground font-medium text-sm"
              >
                Configurações
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
