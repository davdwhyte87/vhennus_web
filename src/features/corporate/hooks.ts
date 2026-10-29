import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Reveals elements carrying the `vh-reveal` class as they enter the viewport.
 * The animation itself lives in CSS, and is disabled for reduced-motion users.
 */
export function useRevealObserver() {
  const { pathname } = useLocation()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.vh-reveal'))
    if (nodes.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => {
        node.dataset.visible = 'true'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const node = entry.target as HTMLElement
          node.dataset.visible = 'true'
          observer.unobserve(node)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [pathname])
}

/**
 * Scrolls to a hash target once its (possibly lazy-loaded) page has rendered.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'

    let frame = 0
    let attempts = 0

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' })
        return
      }
      attempts += 1
      if (attempts < 30) frame = window.requestAnimationFrame(scrollToTarget)
    }

    frame = window.requestAnimationFrame(scrollToTarget)
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])
}
