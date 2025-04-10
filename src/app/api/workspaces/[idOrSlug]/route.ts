import { withWorkspace } from '@/lib/auth/with-workspace'
import { NextResponse } from 'next/server'

export const GET = withWorkspace(async ({ workspace }) => {
  return NextResponse.json({
    workspace,
  })
})
