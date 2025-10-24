import type React from 'react'

export const FooterCredit = (): React.JSX.Element => {
    return (
        <footer
            className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted-primary backdrop-blur"
            aria-label="Project attribution"
        >
            <span className="opacity-80">Originally created by&nbsp;</span>
            <a
                href="https://github.com/jubalm/augur-fork-meter"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary/80"
            >
                @jubalm
            </a>
        </footer>
    )
}
