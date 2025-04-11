'use client'

import { KpiCreationForm } from '@/components/formula/kpi-create-formula'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'

export const NewKpiPageClient = () => {
  return (
    <MaxWidthWrapper>
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        Novo KPI
      </h1>
      <p className="mb-2 mt-2 text-base text-neutral-600">
        Crie uma formula para o seu KPI
      </p>

      <KpiCreationForm />
    </MaxWidthWrapper>
  )
}
