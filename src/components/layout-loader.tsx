import { Loader } from 'lucide-react'

export default function LayoutLoader() {
  return (
    <div className="flex h-[calc(100vh-68px)] items-center justify-center">
      <Loader className="text-muted-foreground animate-spin" />
    </div>
  )
}
