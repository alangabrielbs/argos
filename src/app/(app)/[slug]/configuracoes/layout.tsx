import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Link from 'next/link'

export default async function SettingsConnectionsLayout({
  children,
  params,
}: {
  params: Promise<{
    slug: string
  }>
  children: React.ReactNode
}) {
  const { slug } = await params
  return (
    <>
      <div className="bg-slate-50 py-0.5 -mt-1">
        <MaxWidthWrapper>
          <nav>
            <ul className="flex justify-end items-center gap-x-6">
              <li>
                <Link
                  href={`/${slug}/configuracoes/fontes-de-dados`}
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Fontes de dados
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
      {children}
    </>
  )
}
