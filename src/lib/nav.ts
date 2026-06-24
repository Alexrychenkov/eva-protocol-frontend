/**
 * SPA navigation — change the URL WITHOUT a full page reload.
 *
 * The previous dev navigated with `window.location.href = path`, which reloads
 * the whole 4.9MB bundle (and re-inits the wallet stack) on every tab click —
 * that's what froze the browser, especially while the 3D landing was running.
 *
 * App.tsx already updates its route on `popstate`, so pushing state + firing a
 * synthetic popstate makes it re-render the new page instantly. Leaving the
 * landing this way unmounts the WebGL canvas (freeing the GPU) instead of
 * tearing it down through a reload.
 */
export function goTo(path: string): void {
  if (typeof window === 'undefined') return
  // Always push + fire popstate (even if the URL was already changed by a
  // react-router navigate() call just before) so App.tsx re-renders the route.
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}
