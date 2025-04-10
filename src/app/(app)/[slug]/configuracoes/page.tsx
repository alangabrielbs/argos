import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div>
      <div className="bg-slate-50 py-0.5 -mt-1">
        <MaxWidthWrapper>
          <nav>
            <ul className="flex justify-end items-center gap-x-6">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Conexões
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground font-medium text-sm hover:underline"
                >
                  Snippets
                </Link>
              </li>
              <li>
                <Link
                  href="/"
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
