import { redirect } from 'next/navigation'
import { SimulationPageClient } from './page-client'

export default async function SimulationPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  if (!id) {
    return redirect('/simulacoes')
  }

  return <SimulationPageClient id={id} />
}
