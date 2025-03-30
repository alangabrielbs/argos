'use client'

import { KeyboardShortcutProvider } from '@/hooks/use-keyboard-shortcut'
import * as React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <KeyboardShortcutProvider>{children}</KeyboardShortcutProvider>
}
