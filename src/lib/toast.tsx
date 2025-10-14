// import { Transition } from '@headlessui/react'
// import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
// import { XMarkIcon } from '@heroicons/react/20/solid'
import { type Toast, toast, useToaster } from 'react-hot-toast/headless'
import clsx from 'clsx'

export function Toaster() {
  const { toasts } = useToaster()
  // const { startPause, endPause, updateHeight, calculateOffset } = handlers
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          {toasts.map((t) => (
            <Notification key={t.id} t={t} />
          ))}
        </div>
      </div>
    </>
  )
}

const ColorMap: Record<Toast['type'], { icon: React.FC; title: string; iconColor: string }> = {
  success: {
    icon: CheckCircleIcon,
    title: 'Success',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: ExclamationCircleIcon,
    title: 'Error',
    iconColor: 'text-rose-400',
  },
  loading: {
    icon: InformationCircleIcon,
    title: 'Loading',
    iconColor: 'text-blue-400',
  },
  blank: {
    icon: InformationCircleIcon,
    title: 'Blank',
    iconColor: 'text-zinc-400',
  },
  custom: {
    icon: InformationCircleIcon,
    title: 'Custom',
    iconColor: 'text-zinc-400',
  },
}

export function Notification({ t }: { t: Toast }) {
  const map = ColorMap[t.type]
  const Icon = (t.icon || map.icon) as React.FC
  return (
    <>
      <Transition show={t.visible}>
        <div
          className={clsx(
            'pointer-events-auto w-full max-w-sm rounded-lg  shadow-lg bg-white ring-1 ring-inset ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10 transition',
            'data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0',
          )}
          {...t.ariaProps}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                {/*@ts-expect-error Yuh*/}
                <Icon aria-hidden="true" className={clsx('size-6', map.iconColor)} />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-zinc-950 dark:text-white">{map.title}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {typeof t.message === 'function' ? t.message(t) : t.message}
                </p>
              </div>
              <div className="ml-4 flex shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id)
                  }}
                  className="inline-flex rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}
