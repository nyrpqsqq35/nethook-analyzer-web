import { Text } from '@/components/text'
import { Subheading } from '@/components/heading.tsx'
import { openDirectoryPicker, useSessionStore } from '@/stores/sessionStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { Toaster } from '@/lib/toast.tsx'
import MessageListPane from '@/MessageListPane.tsx'
import { Bar, Container, Section } from '@column-resizer/react'
import ProtobufPane from '@/ProtobufPane.tsx'

function Main() {}

function OpenASession() {
  return (
    <main className="flex-1 h-full p-6">
      <button
        type="button"
        className="relative block w-full h-full rounded-lg bg-zinc-800/20 hover:bg-zinc-800/40 border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-primary-600 dark:border-white/15 dark:hover:border-white/25 dark:focus:outline-primary-500"
        onClick={(e) => {
          e.preventDefault()
          void openDirectoryPicker()
        }}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="mx-auto size-12 text-gray-400 dark:text-gray-500"
        >
          <path
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Subheading className="mt-2">Open a NetHook2 session from disk</Subheading>
        <Text className="">Drop the session folder here</Text>
      </button>
    </main>
  )
}

export default function App() {
  const hasSession = useSessionStore(useShallow((s) => typeof s.session !== 'undefined'))

  return (
    <div className="flex h-full flex-col">
      {hasSession ? (
        <Container className="w-full h-full gap-2 p-4">
          <Section className="shrink-0 h-full" minSize={256}>
            <MessageListPane />
          </Section>
          <Bar
            size={4}
            className="cursor-col-resize rounded-full border border-dashed bg-zinc-400/50 dark:bg-zinc-300/30"
          />
          <Section>
            <ProtobufPane />
          </Section>
        </Container>
      ) : (
        <OpenASession />
      )}
      <Toaster />
    </div>
  )
}
