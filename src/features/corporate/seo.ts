import { useEffect } from 'react'

const DEFAULT_IMAGE = '/images/corporate/hero-architecture.webp'

type PageMeta = {
  title: string
  description: string
  path?: string
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

/**
 * Sets the document title, description, canonical URL and Open Graph / Twitter
 * metadata for a single page. Values are reset naturally on the next page that
 * calls the hook.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const origin = window.location.origin
    const url = `${origin}${path ?? window.location.pathname}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Vhennus')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', `${origin}${DEFAULT_IMAGE}`)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', `${origin}${DEFAULT_IMAGE}`)
    setCanonical(url)
  }, [title, description, path])
}
