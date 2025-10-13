import { Heading } from '@/components/heading.tsx'
import { type NetHookMessage, useSessionStore } from '@/stores/sessionStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { Text } from '@/components/text.tsx'
import { Tree } from 'react-arborist'

function HasMessage({ msg }: { msg: NetHookMessage }) {
  return (
    <>
      <Heading className="flex items-center gap-2 font-mono">{msg.eMsgName}</Heading>
      {/*<Tree>meow</Tree>*/}
    </>
  )
}

export default function ProtobufPane() {
  const { selectedMsg } = useSessionStore(
    useShallow((s) => {
      if (typeof s.session?.selectedSeq === 'undefined') return { selectedMsg: undefined }
      return { selectedMsg: s.session.messages[s.session.selectedSeq] }
    }),
  )

  return selectedMsg ? (
    <HasMessage msg={selectedMsg} />
  ) : (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mx-auto size-12 text-gray-400 dark:text-gray-500"
        >
          <path
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No message selected</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by selecting a message to the side</p>
      </div>
    </div>
  )
}
