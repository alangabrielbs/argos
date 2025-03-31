import { Building2, LucideIcon, StoreIcon } from 'lucide-react'

export type FilterOption = {
  field: {
    id: string
    name: string
    type: 'string' | 'number' | 'boolean' | 'date' | 'select'
    options?: {
      id: string
      label: string
      icon?: LucideIcon
    }[]
    icon?: LucideIcon
  }
}

export const FILTER_OPTIONS = [
  {
    field: {
      id: 'company',
      name: 'Empresa',
      type: 'select',
      options: [
        {
          id: 'gpa',
          label: 'Grupo Pão de Açúcar',
        },
        {
          id: 'mcdonalds',
          label: "McDonald's",
        },
      ],
      icon: StoreIcon,
    },
  },
  {
    field: {
      id: 'state',
      name: 'Estado',
      type: 'select',
      options: [
        {
          id: 'sp',
          label: 'São Paulo',
        },
        {
          id: 'rj',
          label: 'Rio de Janeiro',
        },
      ],
      icon: Building2,
    },
  },
  {
    field: {
      id: 'driver-category',
      name: 'Categoria do driver',
      type: 'select',
      options: [
        {
          id: 'gold',
          label: 'Ouro',
        },
        {
          id: 'silver',
          label: 'Prata',
        },
        {
          id: 'silver-plus',
          label: 'Prata +',
        },
        {
          id: 'bronze',
          label: 'Bronze',
        },
        {
          id: 'bronze-plus',
          label: 'Bronze +',
        },
      ],
      icon: Building2,
    },
  },
  {
    field: {
      id: 'ifood-delivery',
      name: 'Entrega iFood',
      type: 'select',
      options: [
        {
          id: 'yes',
          label: 'Sim',
        },
        {
          id: 'not',
          label: 'Não',
        },
      ],
      icon: Building2,
    },
  },
] satisfies FilterOption[]
