'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SettingsPage() {
  const { slug } = useParams() as { slug?: string }

  return (
    <div>
      <div className="bg-slate-50 py-0.5 -mt-1">
        <MaxWidthWrapper>
          <nav>
            <ul className="flex justify-end items-center gap-x-6">
              <li>
                <Link
                  href={`/${slug}/configuracoes/conexoes`}
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Conexões
                </Link>
              </li>
              <li>
                <Link
                  href={`/${slug}/configuracoes/snippets`}
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Snippets
                </Link>
              </li>
              <li>
                <Link
                  href={`/${slug}/configuracoes/variaveis`}
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Variáveis
                </Link>
              </li>
            </ul>
          </nav>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="mt-4">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </MaxWidthWrapper>
    </div>
  )
}
