import {
  Flag,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Shovel,
  Sparkles,
  Star,
  Swords,
} from 'lucide-react'
import AppCard from '../../../Shared/components/AppCard.tsx'

interface BadgeInfo {
  name: string
  icon: typeof Flag
  tile: string
  iconColor: string
  tagline: string
  body: string[]
  who: string
}

const BADGES: BadgeInfo[] = [
  {
    name: 'Member',
    icon: Star,
    tile: 'bg-sky-100 border-sky-300',
    iconColor: 'text-sky-600',
    tagline: 'For people who have been accepted into the Vhennus community.',
    body: [
      'The Member badge represents belonging. Members have completed the Vhennus membership process and been accepted into the community.',
    ],
    who: 'Any approved Vhennus member.',
  },
  {
    name: 'Contributor',
    icon: HeartHandshake,
    tile: 'bg-teal-100 border-teal-300',
    iconColor: 'text-teal-600',
    tagline:
      'For people who contribute meaningful resources to the growth of Vhennus and its community.',
    body: [
      'Contributions can take many forms — code, money, skills, knowledge, labour, mentorship, introductions, infrastructure, creative work, or other resources that create value for others.',
    ],
    who: 'Developers, investors, mentors, professionals, organizers, volunteers, donors, creators, and anyone making meaningful contributions.',
  },
  {
    name: 'Builder',
    icon: Shovel,
    tile: 'bg-orange-100 border-orange-300',
    iconColor: 'text-orange-600',
    tagline:
      'For people who turn ideas into real-world things that create value.',
    body: [
      'Builders create businesses, organizations, technology, communities, products, infrastructure, and other meaningful projects.',
    ],
    who: 'Entrepreneurs, founders, engineers, product creators, community builders, organizers, and people creating new institutions or ventures.',
  },
  {
    name: 'Inventor',
    icon: Lightbulb,
    tile: 'bg-yellow-100 border-yellow-300',
    iconColor: 'text-yellow-600',
    tagline:
      'For people who create new technology, methods, or systems through discovery, experimentation, and research.',
    body: [
      'The Inventor badge recognizes people who push the boundaries of what is possible and turn new discoveries or ideas into original inventions.',
    ],
    who: 'Scientists, engineers, researchers, technologists, inventors, and other innovators who have created genuinely novel technology or methods.',
  },
  {
    name: 'Scholar',
    icon: GraduationCap,
    tile: 'bg-indigo-100 border-indigo-300',
    iconColor: 'text-indigo-600',
    tagline:
      'For people who make significant contributions to knowledge and understanding.',
    body: [
      'Scholars expand what others know through research, education, writing, analysis, philosophy, investigation, or the development of important ideas and insights.',
    ],
    who: 'Researchers, academics, writers, philosophers, educators, analysts, historians, scientists, and independent thinkers who have made meaningful intellectual contributions.',
  },
  {
    name: 'Luminary',
    icon: Sparkles,
    tile: 'bg-fuchsia-100 border-fuchsia-300',
    iconColor: 'text-fuchsia-600',
    tagline:
      'For people whose work has achieved exceptional influence, recognition, or lasting impact.',
    body: [
      'A Luminary is someone whose work rises above their field and leaves a meaningful mark on culture, knowledge, technology, or society.',
    ],
    who: 'Scientists, researchers, musicians, artists, actors, writers, filmmakers, athletes, inventors, entrepreneurs, engineers, and other exceptional creators or leaders whose work has had significant and lasting impact.',
  },
  {
    name: 'Founder',
    icon: Flag,
    tile: 'bg-amber-100 border-amber-300',
    iconColor: 'text-amber-600',
    tagline:
      'For people who helped establish Vhennus and shape its foundations.',
    body: [
      'The Founder badge recognizes the individuals who were instrumental in creating Vhennus, establishing its early community, building its foundations, or helping define its original direction.',
    ],
    who: 'Individuals formally recognized as founders of Vhennus.',
  },
  {
    name: 'Warrior',
    icon: Swords,
    tile: 'bg-rose-100 border-rose-300',
    iconColor: 'text-rose-600',
    tagline:
      'For people who have demonstrated exceptional courage in defending, protecting, or advancing the Vhennus civilization while accepting significant personal risk or sacrifice.',
    body: [
      'The Warrior badge recognizes people who have put something meaningful on the line — their safety, freedom, livelihood, reputation, resources, or personal security — in order to protect others, defend the community, or stand for a cause they believe is important.',
      'Being a Warrior does not require military service or physical combat. Courage can take many forms: protecting people during a crisis, defending the community from serious threats, taking significant personal risks to help others, or making extraordinary sacrifices for the survival and advancement of the civilization.',
    ],
    who: 'People who have demonstrated exceptional courage, sacrifice, or service in circumstances involving meaningful personal risk. This may include soldiers, emergency responders, community defenders, activists, organizers, humanitarian workers, whistleblowers, or ordinary members who have taken extraordinary risks to protect others or the community.',
  },
]

const BadgesInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="px-5 py-6 text-left sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[.15em] text-[#CC5A2A]">
          Roles, not ranks
        </p>
        <h1 className="mt-2 font-serif text-[clamp(28px,5vw,40px)] tracking-tight text-[#0A1931]">
          What badges mean
        </h1>

        <div className="mt-4 rounded-none border border-[#C9A86A] bg-[#0A1931] p-5 text-left">
          <p className="text-[15px] font-medium leading-[1.7] text-[#F5F5F0]">
            Please note: Vhennus is not a hierarchical community — badges are
            not ladders to be climbed. They represent role, function and
            contribution.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {BADGES.map((badge) => {
            const Icon = badge.icon
            return (
              <AppCard key={badge.name} className="p-5">
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      'grid h-14 w-14 shrink-0 place-items-center rounded-full border bg-white shadow-md',
                      badge.tile,
                    ].join(' ')}
                  >
                    <Icon
                      className={['h-7 w-7 fill-current', badge.iconColor].join(
                        ' '
                      )}
                    />
                  </span>
                  <h2 className="font-serif text-xl text-[#0A1931]">
                    {badge.name}
                  </h2>
                </div>
                <p className="mt-3 text-[15px] font-medium leading-[1.7] text-[#0A1931]">
                  {badge.tagline}
                </p>
                {badge.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="mt-2 text-[15px] leading-[1.7] text-[#4d5666]"
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="mt-3 border-t border-[#C9A86A]/40 pt-3 text-sm leading-[1.7] text-[#4d5666]">
                  <span className="font-medium text-[#0A1931]">
                    Who can hold it:{' '}
                  </span>
                  {badge.who}
                </p>
              </AppCard>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default BadgesInfoPage
