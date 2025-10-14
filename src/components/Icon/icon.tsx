import React, { lazy, type LazyExoticComponent } from 'react'
import clsx from 'clsx'
export interface IconPropTypes extends React.PropsWithChildren {
  className?: string
}

type IconFunction = (props: IconPropTypes) => React.JSX.Element

export default function createIcon(
  getImport: () => Promise<typeof import('*.png')>,
): LazyExoticComponent<IconFunction> {
  return lazy(async () => {
    const iconUrl = await getImport()
    return {
      default: ({ className }: IconPropTypes) => {
        return (
          <img
            className={clsx(className)}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
            src={iconUrl.default}
            width={16}
            height={16}
            alt={'icon'}
          />
        )
      },
    }
  })
}
