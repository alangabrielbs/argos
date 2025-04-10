'use client'

import { KpiCreationForm } from '@/components/formula/kpi-create-formula'

export const NewKpiPageClient = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        Novo KPI
      </h1>
      <p className="mb-2 mt-2 text-base text-neutral-600">
        Crie uma formula para o seu KPI
      </p>

      <KpiCreationForm />
    </div>
  )
}
