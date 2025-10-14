// import { useSessionStore } from '@/stores/sessionStore.ts'
// import { useShallow } from 'zustand/react/shallow'
// import { Toaster } from '@/lib/toast.tsx'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import WindowContainer from '@/components/Window/WindowContainer'
import ContextMenuContainer from '@/components/ContextMenu'

export default function App() {
  // const hasSession = useSessionStore(useShallow((s) => typeof s.session !== 'undefined'))
  return (
    <>
      <WindowContainer />
      <ContextMenuContainer />
      <ReactTooltip id="tip" />
      {/*<Toaster />*/}
    </>
  )
}
