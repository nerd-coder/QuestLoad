import { useStore } from '@tanstack/react-store'
import { InstallerView } from './features/install'
import { shellStore, showView } from './features/shell'

export function App() {
  const view = useStore(shellStore, (state) => state.view)
  return (
    <main className="wrap">
      <h1>QuestLoad</h1>
      <p className="sub">
        Install apps on Meta Quest devices. Developer mode required.{' '}
        <b>By Frizzle.</b>
      </p>
      <nav className="top-nav" aria-label="Primary">
        <div className="top-nav__tabs">
          <button
            className="top-nav__item"
            type="button"
            role="tab"
            aria-selected={view === 'installer'}
            onClick={() => showView('installer')}
          >
            Installer
          </button>
          <button
            className="top-nav__item"
            type="button"
            role="tab"
            aria-selected={view === 'extractor'}
            onClick={() => showView('extractor')}
          >
            Extractor
          </button>
        </div>
        <a
          className="top-nav__github"
          href="https://github.com/FrizzleM/QuestLoad"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </nav>
      {view === 'extractor' ? (
        <section className="extractor-view">COMING SOON</section>
      ) : (
        <InstallerView />
      )}
    </main>
  )
}
