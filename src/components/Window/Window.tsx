import { Rnd } from 'react-rnd'
import clsx from 'clsx'

import { usePreviousDifferent } from 'rooks'
import { useWindowSize } from '@react-hook/window-size'

import style from './window.module.scss'
import { useEffect } from 'react'
import Handle from './handle.svg?react'
import {
  useWindows,
  HConstraint,
  VConstraint,
  type Dimensions,
  setWindowDimensions,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  focusWindow,
  WINDOW_UNINITIALIZED_SIZE,
} from '@/stores/useWindows'
import { ColorWheelIcon } from '../Icon/silk'
import { useShallow } from 'zustand/react/shallow'

type Color = 'default' | 'red' | 'purple'

export interface ChildWindowPropTypes {
  id: string

  closeWindow: () => void
}

export interface WindowPropTypes extends React.PropsWithChildren {
  id: string
  caption?: string
  hideControls?: boolean
  hideMinimize?: boolean
  hideMaximize?: boolean
  hideClose?: boolean

  icon?: React.ElementType
  color?: Color
  glass?: boolean

  hConstraint?: HConstraint
  vConstraint?: VConstraint
  forceConstraints?: boolean
  minWidth?: number
  minHeight?: number
  draggable?: boolean
  resizable?: boolean
}

const MIN_HEIGHT = 100 // px
const MIN_WIDTH = 320 // px

const TITLEBAR_HEIGHT = 28 // px
const WINDOW_PADDING = 10 // px

const DIALOG_ZINDEX_BASE = 1000

export function Window({
  id,
  caption = 'Window',
  hideControls = false,
  hideMinimize = true,
  hideMaximize = true,
  hideClose = false,

  icon: Icon = ColorWheelIcon,
  color = 'purple',
  glass = true,

  hConstraint,
  vConstraint,
  forceConstraints = false,
  minWidth = MIN_WIDTH,
  minHeight = MIN_HEIGHT,
  draggable = true,
  resizable = true,

  children,
}: WindowPropTypes) {
  const { window, zIndex, isForeground } = useWindows(
    useShallow((e) => {
      const window = e.windows.find((i) => i.id === id)!
      const isForeground = e.foregroundWindow === id
      const rzindex = e.focusTable.indexOf(id) || 0
      // reverse the focusTable index, since the newest focused window always goes to the front
      let zIndex = e.focusTable.length - rzindex

      if (isForeground) {
        if (window?.isDialog) zIndex = zIndex + DIALOG_ZINDEX_BASE
      }

      return {
        window,
        zIndex,
        isForeground,
      }
    }),
  )

  const { x, y, width, height } = window.dimensions
  const setDimensions = (cb: (d: Dimensions) => Dimensions) => {
    setWindowDimensions(window, cb(window.dimensions))
  }

  const solveConstraints = (property: 'x' | 'y') => {
    const bndSize = property === 'x' ? windowWidth : windowHeight
    const wndProp = property === 'x' ? 'width' : 'height'
    const constraint = property === 'x' ? hConstraint : vConstraint
    return (e: Dimensions): Dimensions => {
      switch (constraint) {
        case VConstraint.TOP:
        case HConstraint.LEFT:
          return { ...e, [property]: WINDOW_PADDING }

        case HConstraint.CENTER:
          return { ...e, [property]: ((bndSize - e[wndProp]) / 2) | 0 }

        case VConstraint.BOTTOM:
        case HConstraint.RIGHT: // = VConstraint.BOTTOM = 0
          return {
            ...e,
            [property]: (bndSize - e[wndProp] - WINDOW_PADDING) | 0,
          }

        // for taking titlebar height into account
        case VConstraint.CENTER:
          return {
            ...e,
            [property]: ((bndSize - e[wndProp] - TITLEBAR_HEIGHT) / 2) | 0,
          }
      }
      return e
    }
  }

  const [windowWidth, windowHeight] = useWindowSize(),
    previousWidth = usePreviousDifferent(windowWidth)!,
    previousHeight = usePreviousDifferent(windowHeight)!
  const realMinWidth = Math.max(MIN_WIDTH, minWidth),
    realMinHeight = Math.max(MIN_HEIGHT, minHeight)

  useEffect(() => {
    if (typeof hConstraint === 'number' && forceConstraints) {
      setDimensions(solveConstraints('x'))
    } else {
      if (x > windowWidth) {
        setDimensions((e) => ({ ...e, x: windowWidth - (e.x - windowWidth) }))
      } else if (x + width < 0) {
        setDimensions((e) => ({ ...e, x: e.x - (e.x + e.width) * 2 }))
      }
    }
  }, [previousWidth, width, x, hConstraint, forceConstraints])
  useEffect(() => {
    if (typeof vConstraint === 'number' && forceConstraints) {
      setDimensions(solveConstraints('y'))
    } else {
      if (y > windowHeight) {
        setDimensions((e) => ({ ...e, y: windowHeight - (e.y - windowHeight) }))
      } else if (y + height < 0) {
        setDimensions((e) => ({ ...e, y: e.y - (e.y + e.height) * 2 }))
      }
    }
  }, [previousHeight, height, y, vConstraint, forceConstraints])
  useEffect(() => {
    setDimensions((e) => ({
      ...e,
      width: realMinWidth > e.width ? realMinWidth : e.width,
      height: realMinHeight > e.height ? realMinHeight : e.height,
    }))
    if (x === WINDOW_UNINITIALIZED_SIZE || y === WINDOW_UNINITIALIZED_SIZE) {
      const svcX = solveConstraints('x'),
        svcY = solveConstraints('y')
      let dims = window.dimensions
      dims = svcX(dims)
      dims = svcY(dims)
      const windows = useWindows.getState().windows
      for (const w of windows) {
        if (w.dimensions.x === dims.x && w.dimensions.y === dims.y) {
          dims.x += 10
          dims.y += 10
        }
      }
      setDimensions(() => dims)
    }
  }, [forceConstraints])

  const onMinimizeClicked = () => minimizeWindow(window)
  const onMaximizeClicked = () => maximizeWindow(window)
  const onCloseClicked = () => closeWindow(window)

  const onWindowMouseDown = () => focusWindow(window)

  return (
    <>
      <Rnd
        className={clsx('window has-scrollbar', {
          [style[color]]: !!color,
          glass: glass,
          active: isForeground,
          // [style.inactive]: !isForeground,
        })}
        style={{
          zIndex,
        }}
        position={{ x, y }}
        size={{ width, height }}
        dragHandleClassName="title-bar"
        resizeHandleComponent={{
          bottomRight: <Handle className={style.handle} />,
        }}
        resizeHandleStyles={{
          right: {
            cursor: 'e-resize',
          },
          left: {
            cursor: 'w-resize',
          },
          top: {
            cursor: 'n-resize',
          },
          bottom: {
            cursor: 's-resize',
          },
        }}
        cancel="button"
        onDragStop={(_, d) => setDimensions((e) => ({ ...e, x: d.x, y: d.y }))}
        onResizeStop={(_, _direction, ref, _delta, position) =>
          setDimensions((e) => ({
            ...e,
            ...position,
            width: parseInt(ref.style.width, 10), // please be px
            height: parseInt(ref.style.height, 10),
          }))
        }
        minWidth={realMinWidth}
        minHeight={realMinHeight}
        enableResizing={resizable}
        disableDragging={!draggable}
        onMouseDown={onWindowMouseDown}
      >
        <div className="title-bar">
          <div className="title-bar-text">
            {Icon && <Icon />}
            {caption}
          </div>
          {!hideControls && (
            <div className="title-bar-controls">
              {!hideMinimize && <button aria-label="Minimize" onClick={onMinimizeClicked}></button>}
              {!hideMaximize && <button aria-label="Maximize" onClick={onMaximizeClicked}></button>}
              {!hideClose && <button aria-label="Close" onClick={onCloseClicked}></button>}
            </div>
          )}
        </div>
        <div className="window-body">{children}</div>
      </Rnd>
      {window.isDialog && isForeground && (
        <div
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            zIndex: DIALOG_ZINDEX_BASE,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  )
}
