import { SimularionHeader } from './header'

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-4">
      <SimularionHeader />
      {children}
    </div>
  )
}
