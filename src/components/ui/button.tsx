import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import { ReactNode, forwardRef } from 'react'

export const buttonVariants = cva('transition-all', {
  variants: {
    variant: {
      primary:
        'border-black bg-black text-white hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200',
      secondary: cn(
        'border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 focus-visible:border-neutral-500 outline-none',
        'data-[state=open]:border-neutral-500 data-[state=open]:ring-4 data-[state=open]:ring-neutral-200'
      ),
      outline: 'border-transparent text-neutral-600 hover:bg-neutral-100',
      success:
        'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:ring-4 hover:ring-blue-100',
      danger:
        'border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 hover:ring-red-100',
      'danger-outline':
        'border-transparent bg-white text-red-500 hover:bg-rose-50 hover:text-whitea',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9 p-0 shrink-0',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text?: ReactNode | string
  textWrapperClassName?: string
  shortcutClassName?: string
  loading?: boolean
  icon?: ReactNode
  shortcut?: string
  right?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      variant = 'primary',
      className,
      textWrapperClassName,
      shortcutClassName,
      loading,
      icon,
      shortcut,
      right,
      size,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
        type={props.onClick ? 'button' : 'submit'}
        className={cn(
          'group cursor-pointer flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm',
          props.disabled || loading
            ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 outline-none'
            : buttonVariants({ variant, size }),
          className
        )}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader className="size-5 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {text && (
          <div
            className={cn(
              'min-w-0 truncate',
              shortcut && 'flex-1 text-left',
              textWrapperClassName
            )}
          >
            {text}
          </div>
        )}
        {shortcut && (
          <kbd
            className={cn(
              'hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block',
              {
                'bg-neutral-700 text-neutral-400 group-hover:bg-neutral-600 group-hover:text-neutral-300':
                  variant === 'primary',
                'bg-neutral-200 text-neutral-400 group-hover:bg-neutral-100 group-hover:text-neutral-500':
                  variant === 'secondary',
                'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200':
                  variant === 'outline',
                'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white':
                  variant === 'danger-outline',
                'bg-blue-400 text-blue-100 group-hover:bg-blue-500 group-hover:text-white':
                  variant === 'success',
              },
              shortcutClassName
            )}
          >
            {shortcut}
          </kbd>
        )}
        {right}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
