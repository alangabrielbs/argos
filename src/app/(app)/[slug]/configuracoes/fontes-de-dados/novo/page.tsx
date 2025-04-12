import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Link from 'next/link'

export default async function SettingsConnectionsNewPage({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params

  return (
    <MaxWidthWrapper className="flex flex-col mt-8">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-lg font-medium leading-6 text-gray-900">
          Selecione o tipo de fonte de dados
        </h1>
      </header>

      <div className="w-full pt-6 flex gap-x-4 gap-y-4 flex-wrap">
        <DataSourceBlock
          icon="/icons/databrickssql.png"
          name="Databricks SQL"
          href={`/${slug}/configuracoes/fontes-de-dados/novo/databrickssql`}
        />
      </div>
    </MaxWidthWrapper>
  )
}

type DataSourceBlockProps = {
  name: string
  icon: string
  href: string
}

const DataSourceBlock = ({ name, icon, href }: DataSourceBlockProps) => {
  return (
    <Link
      href={href}
      className="py-5 px-3 w-32 h-32 border border-gray-200 rounded-md flex flex-col items-center justify-between bg-gray-50 hover:bg-ceramic-50 hover:border-gray-300"
    >
      <img src={icon} alt="" className="h-12 w-12" />
      <span className="text-sm">{name}</span>
    </Link>
  )
}
