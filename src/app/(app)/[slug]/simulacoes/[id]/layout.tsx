import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { SimularionHeader } from './header'

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MaxWidthWrapper className="grid gap-4">
      <SimularionHeader />
      {children}
    </MaxWidthWrapper>
  )
}
