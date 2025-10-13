import { type Direction, type NetHookMessage, setSelectedMessage, useSessionStore } from '@/stores/sessionStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { useMemo, useRef, useState } from 'react'
import { Heading } from '@/components/heading.tsx'
import { Badge, Badge2 } from '@/components/badge.tsx'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Code, Text } from '@/components/text.tsx'
import clsx from 'clsx'
import { Button } from './components/button'
import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/solid'

function DirectionBadge({ direction }: { direction: Direction }) {
  return <Badge2 color={direction === 'in' ? 'blue' : 'red'}>{direction == 'in' ? 'In' : 'Out'}</Badge2>
}

export type SortOrder = 'asc' | 'desc'

const ascPredicate = (a: NetHookMessage, b: NetHookMessage) => (a.seq < b.seq ? 1 : -1),
  descPredicate = (a: NetHookMessage, b: NetHookMessage) => (a.seq > b.seq ? 1 : -1)

export default function MessageListPane() {
  const session = useSessionStore(useShallow((s) => s.session!))

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const sortedMessages = useMemo(() => {
    const values = Object.values(session.messages)
    return values.sort(sortOrder === 'asc' ? ascPredicate : descPredicate)
  }, [session.messages, sortOrder])

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: sortedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  return (
    <>
      <Heading className="flex items-center gap-2">
        Messages <Badge color="blue">{sortedMessages.length}</Badge> <div className="flex-1" />
        <Button
          className=""
          outline
          onClick={() => {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
          }}
        >
          {sortOrder === 'asc' ? <BarsArrowDownIcon /> : <BarsArrowUpIcon />}
        </Button>
      </Heading>
      <div className="mt-2 overflow-hidden rounded-lg h-full border-1 border-zinc-950/5 dark:bg-zinc-900 dark:border-white/10">
        <div
          className={clsx(
            'h-full overflow-auto rounded-lg',
            'scheme-dark scrollbar-thin scrollbar-thumb-zinc-500/50 scrollbar-track-zinc-800 scrollbar-thumb',
          )}
          ref={parentRef}
        >
          {/* The large inner element to hold all of the items */}
          <div
            className="relative w-full rounded-lg"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const msg = sortedMessages[virtualItem.index]
              return (
                <button
                  key={virtualItem.key}
                  className={clsx(
                    'absolute top-0 left-0 w-full p-2 gap-x-2',
                    'flex items-center',
                    'hover:bg-zinc-100 dark:hover:bg-zinc-600/50',
                    {
                      'ring-1 ring-inset ring-primary-500 rounded-lg': session.selectedSeq === msg.seq,
                    },
                  )}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedMessage(msg.seq)
                  }}
                >
                  <DirectionBadge direction={msg.direction} />
                  <Text className="!text-xs">#{msg.seq}</Text>
                  <Code>{msg.eMsgName}</Code>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
