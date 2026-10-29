import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../seo'

export default function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy — Vhennus',
    description:
      'How Vhennus handles information you send to us by email.',
    path: '/privacy',
  })

  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      intro="This policy explains how Vhennus handles information you send to us by email."
      sections={[
        {
          title: 'Scope',
          body: (
            <>
              <p>
                This policy applies to the corporate pages of the Vhennus website. The Vhennus
                Network application is a separate service with its own account, messaging, and
                notification features; its use is governed by the terms presented within that
                service.
              </p>
            </>
          ),
        },
        {
          title: 'Information you provide',
          body: (
            <>
              <p>
                When you email us, you choose what information to include, such as your name,
                business name, email address, country, industry, and a description of your business
                or idea.
              </p>
              <p>
                Please do not include confidential information in a first message. A short
                introduction is enough for us to understand whether a conversation makes sense.
              </p>
            </>
          ),
        },
        {
          title: 'How we use it',
          body: (
            <>
              <p>
                Information you send by email is used to review and respond to your inquiry, to
                understand the opportunity you have described, and to maintain appropriate records
                of the conversation.
              </p>
              <p>We do not sell personal information.</p>
            </>
          ),
        },
        {
          title: 'How email is handled',
          body: (
            <>
              <p>
                Emails sent to team@vhennus.org are received and stored by our email provider. We do
                not operate contact forms on this website, and no information is collected through
                the site itself.
              </p>
              <p>
                We may use service providers to operate this website or handle communications. Where
                that occurs, information is shared only as needed for those services.
              </p>
            </>
          ),
        },
        {
          title: 'Retention',
          body: (
            <>
              <p>
                Inquiry information is kept only for as long as needed for the purpose for which it
                was provided, or as required by applicable law.
              </p>
            </>
          ),
        },
        {
          title: 'Your choices',
          body: (
            <>
              <p>
                You may ask us to access, correct, or delete the information you have sent us. To
                make a request, email{' '}
                <a href="mailto:team@vhennus.org" className="vh-underline text-vh-forest">
                  team@vhennus.org
                </a>{' '}
                and describe what you would like us to do.
              </p>
            </>
          ),
        },
        {
          title: 'Changes to this policy',
          body: (
            <>
              <p>
                We may update this policy as the website or our processes change. The date at the top
                of this page indicates when it was last revised.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
