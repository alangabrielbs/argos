'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { useDataSources } from '@/lib/swr/use-data-sources'
import { cn } from '@/lib/utils'
import { Plus, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SettingsConnectionsPage() {
  const { slug } = useParams() as { slug?: string }
  const { dataSources } = useDataSources()

  console.log(dataSources)

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
      <div>
        <div className="w-full pt-6 flex gap-x-4 gap-y-4 flex-wrap">
          {dataSources?.map(dataSource => (
            <div
              key={dataSource.id}
              className="py-5 px-3 w-full border border-gray-200 rounded-md flex flex-col items-start justify-between bg-white hover:bg-ceramic-50 hover:border-gray-300"
            >
              <div className="flex items-center gap-x-2">
                <img src="/icons/databrickssql.png" alt="" className="size-6" />
                <span className="text-sm">{dataSource.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
