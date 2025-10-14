import { Window, type ChildWindowPropTypes } from '@/components/Window'
import { HConstraint, VConstraint } from '@/stores/useWindows'
import { HeartIcon } from '@/components/Icon/fugue'

export function AcknowledgementsWindow({ id }: ChildWindowPropTypes) {
  return (
    <Window
      id={id}
      icon={HeartIcon}
      caption="Acknowledgments"
      hConstraint={HConstraint.CENTER}
      vConstraint={VConstraint.CENTER}
      forceConstraints
      draggable={false}
      resizable={false}
      minWidth={320}
      minHeight={200}
      hideMinimize
      hideMaximize
    >
      <div
        className="has-scrollbar"
        style={{ display: 'flex', flexDirection: 'column', padding: '2px 16px', overflowY: 'auto', height: '100%' }}
      >
        <p>
          This project makes extensive use of the following third-party libraries and resources. We gratefully
          acknowledge their authors and contributors:
        </p>
        <details>
          <summary>NetHookAnalyzer2</summary>
          <p>
            <a
              href="https://github.com/SteamRE/SteamKit/tree/master/Resources/NetHookAnalyzer2"
              target="_blank"
              rel="noreferrer"
            >
              Released under the LGPL 2.1 license.
            </a>
          </p>
        </details>
        <details>
          <summary>SteamKit</summary>
          <p>
            <a href="https://github.com/SteamRE/SteamKit" target="_blank" rel="noreferrer">
              Released under the LGPL 2.1 license.
            </a>
          </p>
        </details>
        <details>
          <summary>7.css</summary>
          <p>
            <a href="https://github.com/khang-nd/7.css" target="_blank" rel="noreferrer">
              Released under the MIT license.
            </a>
          </p>
        </details>
        <details>
          <summary>Fugue Icons</summary>
          <p>
            Some icons by{' '}
            <a href="http://p.yusukekamiyamane.com/" target="_blank" rel="noreferrer">
              Yusuke Kamiyamane
            </a>
            . Licensed under a{' '}
            <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">
              Creative Commons Attribution 3.0 License
            </a>
            .
          </p>
        </details>
        <details>
          <summary>Silk Icons</summary>
          <p>
            Icons by{' '}
            <a
              href="https://web.archive.org/web/20210324031107/http://www.famfamfam.com/lab/icons/silk/"
              target="_blank"
              rel="noreferrer"
            >
              Mark James
            </a>
            . Licensed under a{' '}
            <a href="https://creativecommons.org/licenses/by/2.5/" target="_blank" rel="noreferrer">
              Creative Commons Attribution 2.5 License
            </a>
            .
          </p>
        </details>
      </div>
    </Window>
  )
}
