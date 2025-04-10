'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SettingsConnectionsPage() {
  const { slug } = useParams() as { slug?: string }

  return (
    <MaxWidthWrapper className="mt-6">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-lg font-medium leading-6 text-gray-900">
          Fontes de dados
        </h1>
        <div>
          <Link
            className={cn(
              'group cursor-pointer flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm',
              buttonVariants({ variant: 'success', size: 'default' })
            )}
            href={`/${slug}/configuracoes/fontes-de-dados/novo`}
          >
            Adicionar fonte de dados
          </Link>
        </div>
      </header>
    </MaxWidthWrapper>
  )
}
