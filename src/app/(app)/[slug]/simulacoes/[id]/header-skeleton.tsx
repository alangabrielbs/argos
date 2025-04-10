import { TabSelect } from '@/components/tab-select'

export const HeaderSkeleton = () => {
  return (
    <div className="border-b border-neutral-200">
      <div />

      <div className="flex items-center justify-between">
        <div className="">
          <div className="h-[32px] w-96 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-[18px] my-2 mt-3 w-44 animate-pulse rounded-md bg-neutral-200" />
        </div>

        <div className="h-[36px] my-2 w-[190px] animate-pulse rounded-md bg-neutral-200" />
      </div>

      <div className="flex items-center gap-x-3 mt-3">
        <div className="mx-2">
          <div className="h-[18px] my-2 w-[100px] animate-pulse rounded-md bg-neutral-100" />
          <div className="h-[2px] w-[100px] animate-pulse rounded-md bg-neutral-100" />
        </div>

        <div>
          <div className="h-[18px] my-2 w-[52px] animate-pulse rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}
