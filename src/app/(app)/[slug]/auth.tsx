'use client'

import LayoutLoader from '@/components/layout-loader'
import { useWorkspace } from '@/lib/swr/use-workspace'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export default function WorkspaceAuth({ children }: { children: ReactNode }) {
  const { isLoading, error } = useWorkspace()

  if (isLoading) {
    return <LayoutLoader />
  }

  if (error && error.status === 404) {
    notFound()
  }

  return children
}
