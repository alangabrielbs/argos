import {
  BikeIcon,
  BoxesIcon,
  Clock,
  LucideIcon,
  MoreHorizontal,
  PizzaIcon,
  ShieldAlertIcon,
  ShoppingBasketIcon,
  SwatchBookIcon,
  UserIcon,
} from 'lucide-react'

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
      id: 'grupo_denominador',
      name: 'Grupo Denominador',
      type: 'select',
      options: [
        {
          id: 'GERAL',
          label: 'GERAL',
          icon: BoxesIcon,
        },
        {
          id: 'FOOD',
          label: 'FOOD',
          icon: PizzaIcon,
        },
        {
          id: 'GROCERIES',
          label: 'GROCERIES',
          icon: ShoppingBasketIcon,
        },
      ],
      icon: BoxesIcon,
    },
  },
  {
    field: {
      id: 'tema_projetado',
      name: 'Tema Projetado',
      type: 'select',
      options: [
        {
          id: 'Atraso',
          label: 'Atraso',
          icon: Clock,
        },
        {
          id: 'Consumer',
          label: 'Consumer',
          icon: UserIcon,
        },
        {
          id: 'Fraude Maquininha',
          label: 'Fraude Maquininha',
          icon: ShieldAlertIcon,
        },
        {
          id: 'Driver',
          label: 'Driver',
          icon: BikeIcon,
        },
        {
          id: 'Outros',
          label: 'Outros',
          icon: MoreHorizontal,
        },
      ],
      icon: SwatchBookIcon,
    },
  },
] satisfies FilterOption[]
