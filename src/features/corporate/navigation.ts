export type NavItem = {
  label: string
  to: string
}

export const primaryNav: NavItem[] = [
  { label: 'Capital', to: '/capital' },
  { label: 'Network', to: '/social' },
  { label: 'Ventures', to: '/vc' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const ecosystemNav: NavItem[] = [
  { label: 'Vhennus Capital', to: '/capital' },
  { label: 'Vhennus Network', to: '/social' },
  { label: 'Vhennus Ventures', to: '/vc' },
]

export const companyNav: NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
]
