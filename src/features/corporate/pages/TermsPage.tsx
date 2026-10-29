import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../seo'

export default function TermsPage() {
  usePageMeta({
    title: 'Terms — Vhennus',
    description: 'The terms that apply to the use of the Vhennus corporate website.',
    path: '/terms',
  })

  return (
    <LegalPage
      title="Terms of Use"
      updated="October 2026"
      intro="These terms apply to your use of the Vhennus corporate website. By using the site, you agree to them."
      sections={[
        {
          title: 'Informational purpose',
          body: (
            <>
              <p>
                This website describes Vhennus, its strategy, and the parts of its ecosystem. It is
                provided for general information only.
              </p>
              <p>
                Nothing on this website is an offer to sell, a solicitation of an offer to buy, or a
                recommendation regarding any security, business, or investment. Nothing here is
                investment, legal, tax, or financial advice.
              </p>
            </>
          ),
        },
        {
          title: 'Forward-looking statements',
          body: (
            <>
              <p>
                References to plans, ambitions, areas of interest, and intended ways of working
                describe Vhennus’s strategy and long-term intention. They are not guarantees of
                future activity or results.
              </p>
              <p>
                Nothing on this website should be read as a representation of completed
                acquisitions, portfolio holdings, investment performance, or financial results.
              </p>
            </>
          ),
        },
        {
          title: 'The Vhennus Network',
          body: (
            <>
              <p>
                Access to the Vhennus Network application is subject to the account terms presented
                within that service. These website terms do not replace those terms.
              </p>
            </>
          ),
        },
        {
          title: 'Intellectual property',
          body: (
            <>
              <p>
                The content, design, and marks on this website belong to Vhennus or are used with
                permission. You may view and share links to the site, but you may not reproduce or
                republish its content for commercial purposes without written permission.
              </p>
            </>
          ),
        },
        {
          title: 'Third-party links',
          body: (
            <>
              <p>
                This website may link to services operated by others. We are not responsible for
                their content, availability, or privacy practices.
              </p>
            </>
          ),
        },
        {
          title: 'Availability',
          body: (
            <>
              <p>
                We aim to keep this website accurate and available, but it is provided on an “as is”
                basis. We may change, suspend, or withdraw any part of it without notice.
              </p>
            </>
          ),
        },
        {
          title: 'Contact',
          body: (
            <>
              <p>
                Questions about these terms can be sent by email to{' '}
                <a href="mailto:team@vhennus.org" className="vh-underline text-vh-forest">
                  team@vhennus.org
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
