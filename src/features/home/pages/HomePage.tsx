import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeDollarSign, Coins, Fingerprint, Globe2, Layers3, Menu, Network, ShieldCheck, Store, X, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore'
import aquariusLogo from '../../../assets/vlogosm.png'
import heroImge from '../../../assets/hero1.png'
import cloudToLandImage from '../../../assets/cloudtoland.png'
import vhenncoin from '../../../assets/vhenncoin.svg'
import { WHITE_PAPER_URL } from '../../membership/membershipUtils'


const pillars = [
  { number: '01', title: 'Wealth creation', text: 'Build businesses. Create jobs. Generate prosperity. Share the value created with the community.', tag: 'PROSPERITY' },
  { number: '02', title: 'Innovation', text: 'Fund curiosity. Support research. Build new technologies. Explore ideas that could make life better.', tag: 'POSSIBILITY' },
  { number: '03', title: 'Community', text: 'Choose we over me. Bring your skills, capital, knowledge and ideas—and use them to build something bigger than yourself.', tag: 'TOGETHER' },
]

const coinPillars = [
  { icon: Store, n: '01', name: 'Token Market', type: 'BUY & SELL COMPANIES', text: 'Buy and sell Vhennus companies from anywhere. Own a stake in the businesses being built inside the civilization — no matter where you live.' },
  { icon: Coins, n: '02', name: 'Vhenncoin', type: 'BACKED BY THE NETWORK', text: 'Hold Vhenncoins backed by a global network of companies. One currency for the whole civilization — rooted in real builders and real value.' },
]

const blockchainFeatures = [
  { title: 'Built for speed', text: 'Fast transaction processing and rapid finality, designed for an economy where thousands or millions of people can transact and build simultaneously.', icon: Zap },
  { title: '0 transaction fees', text: 'Users shouldn’t have to think about gas fees every time they send money or interact with an application.', icon: BadgeDollarSign },
  { title: 'Proof of Stake', text: 'The network uses Proof of Stake to secure the blockchain and coordinate a decentralized network of validators.', icon: ShieldCheck },
  { title: 'Permissionless', text: 'Anyone should be able to build, deploy applications, participate in the network and contribute to the ecosystem without needing permission from a central authority.', icon: Network },
  { title: 'Built for scale', text: 'Vhennus uses a different approach to blockchain architecture, designed to enable transactions to happen in parallel rather than forcing everything through a single global sequence.', icon: Layers3 },
  { title: 'Human-readable', text: 'Blockchain infrastructure should feel like normal technology. Human-readable identities and simple wallets make the network easier to use.', icon: Fingerprint },
]

const reveal = 'reveal translate-y-4 opacity-0 transition-[opacity,transform] duration-700 [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100'
const eyebrow = 'font-mono text-[11px] uppercase tracking-[.14em] text-[#5d6470]'
const display = "font-medium leading-[1.03] tracking-[-.055em]"
const navLink = 'text-sm text-[#354052] transition-colors hover:text-[#CC5A2A]'
const textLink = 'inline-flex items-center gap-2 border-b border-[#C9A86A] pb-1 text-[13px] text-[#0A1931]'

export default function HomePage() {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.13 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  const enter = () => navigate(isLoggedIn ? '/home/feeds' : '/signup')
  const links = <>
    <a className={navLink} href="#vision" onClick={() => setMenuOpen(false)}>Our vision</a>
    <a className={navLink} href="#principles" onClick={() => setMenuOpen(false)}>Principles</a>
    <a className={navLink} href="#coin" onClick={() => setMenuOpen(false)}>Vhenncoin</a>
  </>

  return <div className="min-h-screen overflow-x-hidden bg-[#F5F5F0] text-[#0A1931]">
    <header className={`fixed left-0 top-0 z-30 flex h-[78px] w-full items-center justify-between px-[7.1%] transition-[background,box-shadow] ${scrolled ? 'bg-[#F5F5F0]/95 shadow-[0_1px_0_#0A193117] backdrop-blur-md' : ''}`}>
      <a className="flex items-center" href="#top" aria-label="Vhennus home"><img src={aquariusLogo} alt="Vhennus Aquarius logo" className="aquarius-logo h-9 w-auto max-w-[150px] object-contain object-left"/></a>
      <nav className="ml-11 hidden gap-[35px] md:flex">{links}</nav>
      <div className="hidden items-center gap-[22px] md:flex"><a className={navLink} href={WHITE_PAPER_URL} target="_blank" rel="noopener noreferrer">Download whitepaper</a><button className="group flex items-center gap-3.5 border border-[#0A1931] bg-transparent px-[17px] py-3.5 text-[13px] text-[#0A1931] transition-colors hover:border-[#0A1931] hover:bg-[#0A1931] hover:text-white" onClick={enter}>Join Vhennus <ArrowUpRight size={16}/></button></div>
      <button className="grid place-items-center border-0 bg-transparent p-2 text-[#353830] md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      {menuOpen && <nav className="absolute left-0 top-[68px] flex w-full flex-col gap-5 border-t border-[#C9A86A] bg-[#F5F5F0] px-[7%] py-6 shadow-xl md:hidden">{links}<button className="flex justify-between border border-[#0A1931] px-3.5 py-3 text-left text-xs" onClick={enter}>Join Vhennus <ArrowUpRight size={15}/></button><button className="border-0 bg-transparent py-2 text-left text-xs" onClick={() => navigate('/login')}>Log in</button></nav>}
    </header>

    <main id="top">
      <section className="relative grid min-h-[735px] grid-cols-1 items-center gap-9 px-[6%] pb-[61px] pt-[123px] md:h-[min(850px,100vh)] md:min-h-[735px] md:grid-cols-[.91fr_1.09fr] md:gap-[4.1%] md:px-[7.1%] md:pb-10 md:pt-[177px]">
        <div className="relative z-[2] md:-mt-2">
          <p className={`${eyebrow} mb-[23px] flex items-center gap-2.5 md:mb-[30px]`}><span className="size-[7px] rounded-full bg-[#CC5A2A] shadow-[0_0_0_4px_#CC5A2A22]"/>A global community</p>
          <h1 className={`${display} text-balance text-[clamp(48px,12vw,76px)] md:text-[clamp(51px,6.3vw,88px)]`}>A new civilization<br/><span className="font-serif font-medium text-[#CC5A2A]">on Earth.</span></h1>
          <p className="mb-[21px] mt-5 max-w-[490px] text-[18px] leading-[1.7] text-[#4d5666] md:mb-7 md:mt-[26px] md:text-[20px]">Bringing like minded people together globally to build a new civilization.</p>
          <div className="flex items-center gap-[18px] md:gap-[25px]"><button className="inline-flex items-center gap-[19px] bg-[#0A1931] px-5 py-4 text-[13px] text-white transition-colors hover:bg-[#CC5A2A]" onClick={enter}>Join Vhennus <ArrowRight size={18}/></button><a className={textLink} href="#vision">Discover Vhennus <ArrowDown size={15}/></a></div>
          <div className="mt-7 flex items-center gap-2 text-xs text-[#6b7180] md:mt-[67px]"><Globe2 size={16}/><span>Connected everywhere.</span></div>
        </div>
        <div className="relative h-[360px] w-full overflow-hidden bg-[#e1e2e4] md:h-[480px]">
          <img src={heroImge} alt="Vhennus community gathering" className="size-full object-cover" fetchPriority="high" decoding="async"/>
          <div className="absolute inset-0 bg-[#0A1931]/15"/>
          <div className="absolute bottom-5 left-[23px] right-[23px] z-[2] flex justify-between font-mono text-[8px] uppercase tracking-[1.1px] text-[#f7f6ed]"><span>FIG. 01</span><span>A place we make together</span></div><div className="absolute right-5 top-[19px] font-mono text-[8px] tracking-[1px] text-[#657561]">06° 31′ N&nbsp; / &nbsp;03° 22′ E</div>
        </div>
        <div className="absolute bottom-4 left-[6%] right-[6%] flex justify-between border-t border-[#C9A86A] pt-3 font-mono text-[7px] tracking-[1.2px] text-[#5d6470] md:bottom-[31px] md:left-[7.1%] md:right-[7.1%] md:text-[8px]"><span>BETTER SYSTEMS, BUILT TOGETHER</span><span>01 — VHENNUS</span></div>
      </section>

      <section id="vision" className="grid grid-cols-1 items-start gap-6 px-[7%] py-[82px] md:grid-cols-[1fr_2.5fr_.9fr] md:gap-10 md:px-[12.5%] md:py-[143px] md:pb-[155px]">
        <div className={`${reveal} flex gap-3 font-mono text-[10px] tracking-[1.4px] text-[#7c7d75] md:flex-col md:gap-[9px]`}><span className="text-sm text-[#CC5A2A]">01</span><span>THE BIGGER IDEA</span></div>
        <div className={reveal}><p className={`${eyebrow} mb-5`}>A shared purpose</p><h2 className={`${display} max-w-[670px] text-[clamp(48px,9vw,70px)] md:text-[clamp(52px,5vw,80px)]`}>One People,<br/><span className="font-serif font-medium text-[#CC5A2A]">One Vision.</span></h2><p className="mt-6 max-w-[650px] text-[19px] leading-[1.7] text-[#4d5666] md:text-[21px]">Humanity has achieved extraordinary things. But we have never agreed on what we’re collectively trying to become.</p><p className="mt-5 max-w-[650px] text-[20px] font-medium leading-[1.65] text-[#CC5A2A] md:text-[22px]">Vhennus is a community built around a shared purpose: to create, discover, and build together.</p></div>
        <div className={`${reveal} ml-1 mt-3 max-w-[280px] border-l border-[#C9A86A] pl-[21px] pt-[7px] md:ml-0 md:mt-[84px]`}><div className="font-serif text-[56px] leading-[.8] text-[#C9A86A]">“</div><p className="my-3.5 font-serif text-[19px] italic leading-[1.55] text-[#354052]">People can build better systems together.</p><span className="font-mono text-[10px] tracking-[1px] text-[#6b7180]">THE VHENNUS IDEA</span></div>
      </section>

      <section id="principles" className="bg-[#0A1931] px-[7%] py-[78px] text-[#F5F5F0] md:px-[12.5%] md:py-[112px] md:pb-[120px]">
        <div className={`${reveal} mb-10 grid gap-6 md:mb-14 md:grid-cols-[1.4fr_.6fr] md:items-end`}><div><p className="mb-5 font-mono text-[11px] uppercase tracking-[.14em] text-[#C9A86A]">02 &nbsp; WHAT GUIDES US</p><h2 className={`${display} text-[clamp(54px,8vw,92px)]`}>Our core<br/><em className="font-serif font-medium text-[#C9A86A]">principles.</em></h2></div><p className="max-w-[370px] text-[18px] leading-[1.75] text-[#d7dce4]">The shared commitments that turn individual ambition into collective progress.</p></div>
        <div className="grid gap-px overflow-hidden border border-[#C9A86A66] bg-[#C9A86A66] md:grid-cols-3">{pillars.map((item) => <article className={`${reveal} group flex min-h-[350px] flex-col bg-[#0A1931] p-8 transition-colors hover:bg-[#132747] md:min-h-[410px] md:p-10`} key={item.number}><div className="flex items-start justify-between"><span className="font-mono text-xs tracking-[.14em] text-[#C9A86A]">{item.number}</span><ArrowUpRight className="text-[#C9A86A] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={22}/></div><div className="mt-auto"><span className="font-mono text-[10px] tracking-[.16em] text-[#d7dce4]">{item.tag}</span><h3 className="mb-4 mt-3 font-serif text-[36px] leading-tight text-[#F5F5F0]">{item.title}</h3><p className="max-w-[320px] text-[17px] leading-[1.7] text-[#d7dce4]">{item.text}</p></div></article>)}</div>
      </section>

      <section id="blockchain" className="bg-[#F5F5F0] px-[7%] py-[78px] md:px-[12.5%] md:py-[120px]">
        <div className={`${reveal} grid gap-8 border-b border-[#C9A86A] pb-12 md:grid-cols-[1.25fr_.75fr] md:gap-16 md:pb-16`}>
          <div><p className={`${eyebrow} mb-5`}>03 &nbsp; THE VHENNUS BLOCKCHAIN</p><h2 className={`${display} max-w-[800px] text-[clamp(45px,6vw,78px)]`}>The infrastructure for a new <em className="font-serif font-medium text-[#CC5A2A]">civilization.</em></h2></div>
          <div className="self-end"><p className="text-[20px] leading-[1.7] text-[#4d5666]">Vhennus is building its own blockchain to power the economy and digital infrastructure of the network.</p><p className="mt-5 font-serif text-[30px] italic leading-[1.35] text-[#0A1931]">A blockchain designed around one simple idea:</p></div>
        </div>
        <div className={`${reveal} py-12 text-center md:py-16`}><p className="font-serif text-[clamp(35px,5vw,65px)] leading-[1.05] tracking-[-.04em] text-[#0A1931]">Move value at the speed of the <span className="text-[#CC5A2A]">internet.</span></p></div>
        <div className="grid border-y border-[#C9A86A] md:grid-cols-2 lg:grid-cols-3">{blockchainFeatures.map((feature, index) => { const Icon = feature.icon; return <article className={`${reveal} group border-b border-[#C9A86A80] p-8 last:border-b-0 md:min-h-[300px] md:border-b md:p-10 lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r lg:[&:nth-last-child(-n+3)]:border-b-0`} key={feature.title}><div className="mb-10 flex items-center justify-between"><span className="font-mono text-[11px] tracking-[.14em] text-[#CC5A2A]">0{index + 1}</span><Icon className="text-[#0A1931] transition-colors group-hover:text-[#CC5A2A]" size={24}/></div><h3 className="mb-3 font-serif text-[32px] leading-none text-[#0A1931]">{feature.title}</h3><p className="max-w-[370px] text-[17px] leading-[1.7] text-[#4d5666]">{feature.text}</p></article>})}</div>
        <div className={`${reveal} grid gap-8 pt-14 md:grid-cols-[.9fr_1.1fr] md:items-end md:pt-20`}><div><p className={`${eyebrow} mb-5`}>Open infrastructure</p><h3 className="max-w-[390px] font-serif text-[41px] leading-[1.1] text-[#0A1931]">The blockchain is not the destination.</h3></div><div><p className="max-w-[630px] text-[20px] leading-[1.7] text-[#4d5666]">The Vhennus blockchain is not just a cryptocurrency ledger. It is infrastructure for <strong className="font-medium text-[#0A1931]">payments, ownership, businesses, applications, identity, governance and the digital economy of Vhennus.</strong></p><p className="mt-5 font-serif text-[29px] italic text-[#CC5A2A]">It is the infrastructure that makes the civilization possible.</p><a href="#blockchain" className={`${textLink} mt-7`}>Explore the technology <ArrowRight size={16}/></a></div></div>
      </section>

      <section className="grid grid-cols-1 items-center gap-9 px-[6%] py-[76px] md:grid-cols-[1.04fr_.96fr] md:gap-[9%] md:px-[7.1%] md:py-[125px]">
        <div className="relative min-h-[330px] overflow-hidden bg-[#dfe1e3] md:min-h-[440px]"><img src={cloudToLandImage} alt="From digital community to physical cities" className="absolute inset-0 size-full object-cover" loading="lazy" decoding="async"/><div className="absolute inset-0 bg-[#0A1931]/20"/><span className="absolute bottom-5 left-[22px] z-[2] font-mono text-[10px] tracking-[1.2px] text-[#F5F5F0]">A SHARED HORIZON &nbsp; / &nbsp; NO FIXED BORDERS</span><span className="absolute right-[17px] top-5 z-[2] [writing-mode:vertical-rl] font-mono text-[10px] tracking-[1.2px] text-[#F5F5F0]">THE FUTURE IS A VERB</span></div>
        <div className={reveal}><p className={`${eyebrow} mb-[21px]`}>Build a civilization</p><h2 className={`${display} mb-[22px] max-w-[500px] text-[56px] md:text-[clamp(49px,4.5vw,70px)]`}>From the cloud to <em className="font-serif font-medium text-[#CC5A2A]">cities.</em></h2><p className="mb-6 max-w-[480px] text-[19px] leading-[1.75] text-[#4d5666]">Vhennus starts as a digital community. Members can build companies, fund research, collaborate, learn, create, invest and participate in a shared economy.</p><p className="mb-6 max-w-[480px] text-[19px] leading-[1.75] text-[#4d5666]">Blockchain provides the infrastructure for ownership, identity and transparent coordination. But technology is only the beginning.</p><a href="#coin" className={textLink}>See what we’re building <ArrowRight size={16}/></a></div>
      </section>

      <section id="coin" className="bg-[#e9ebed] px-[7%] py-[78px] md:px-[12.5%] md:py-[106px] md:pb-[125px]">
        <div className={`${reveal} mb-[31px] md:mb-[47px] md:flex md:items-end md:justify-between`}><div><p className={`${eyebrow} mb-5`}>04 &nbsp; THE CIVILIZATION ECONOMY</p><h2 className={`${display} max-w-[800px] text-[clamp(42px,8vw,74px)] md:text-[clamp(50px,5vw,78px)]`}>Vhenncoin + Token Market = <em className="font-serif font-medium text-[#CC5A2A]">Civilization Economy.</em></h2></div><p className="mt-[18px] max-w-[360px] text-[19px] leading-[1.75] text-[#4d5666] md:mb-[7px] md:ml-[25px] md:mt-0">One economy for a global civilization — where companies, people and currency move together.</p></div>
        <div className={`${reveal} mb-[19px] grid items-center gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-14`}>
          <div className="relative mx-auto w-full max-w-[320px] md:max-w-[380px]">
            <div className="coin-glow absolute inset-[-12%]"/>
            <div className="relative z-[1]"><img src={vhenncoin} alt="Vhenncoin metallic navy coin tilted 18 degrees showing ridged left edge with white Aquarius symbol" className="coin-float w-full drop-shadow-[0_28px_45px_rgba(10,25,49,0.28)]"/></div>
          </div>
          <div className="grid gap-[19px]">{coinPillars.map((item) => { const Icon = item.icon; return <article className={`group bg-[#F5F5F0] p-8 md:p-10`} key={item.n}><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[11px] tracking-[.14em] text-[#CC5A2A]">{item.n}</span><Icon className="text-[#0A1931] transition-colors group-hover:text-[#CC5A2A]" size={26}/></div><p className="mb-2 font-mono text-[11px] tracking-[1.1px] text-[#5d6470]">{item.type}</p><h3 className="mb-4 font-serif text-[34px] font-medium leading-none text-[#0A1931]">{item.name}</h3><p className="max-w-[440px] text-[18px] leading-[1.7] text-[#4d5666]">{item.text}</p></article>})}</div>
        </div>
        <div className={`${reveal} mt-[19px] flex flex-col gap-4 border border-[#C9A86A] bg-[#0A1931] px-8 py-7 text-[#F5F5F0] md:flex-row md:items-center md:justify-between md:px-10`}><p className="font-serif text-[22px] italic leading-[1.4] md:text-[24px]">Buy and sell Vhennus companies from anywhere. Hold Vhenncoins backed by a global network of companies.</p><span className="shrink-0 font-mono text-[10px] tracking-[1.4px] text-[#C9A86A]">ONE PEOPLE · ONE ECONOMY</span></div>
      </section>

      <section className="closing-landscape relative flex min-h-[430px] items-center justify-center overflow-hidden bg-[#0A1931] px-5 py-[75px] text-center text-[#F5F5F0] md:min-h-[480px]"><div className="closing-orbit absolute h-[220px] w-[420px] -rotate-[23deg] rounded-[50%] border border-[#C9A86A2b] md:h-[280px] md:w-[610px]"/><div className={`${reveal} relative z-[1]`}><p className="font-mono text-[11px] uppercase tracking-[.14em] text-[#C9A86A]">Be a builder</p><h2 className={`${display} my-5 text-[clamp(53px,11vw,76px)] md:text-[clamp(56px,6vw,88px)]`}>Build the future<br/><em className="font-serif font-medium text-[#C9A86A]">together.</em></h2><p className="mx-auto mb-7 max-w-[550px] text-[19px] leading-[1.75] text-[#d7dce4]">Vhennus is for entrepreneurs, scientists, engineers, creators, investors and builders. The question isn’t only what Vhennus can give you. It’s what you can build with Vhennus.</p><button className="inline-flex items-center gap-[19px] bg-[#F5F5F0] px-5 py-4 text-[13px] text-[#0A1931] transition-colors hover:bg-[#C9A86A]" onClick={enter}>Join Vhennus <ArrowUpRight size={18}/></button></div><div className="absolute bottom-[25px] right-[6%] z-[2] text-right font-mono text-[9px] leading-[1.8] tracking-[1.1px] text-[#C9A86A] md:right-[7.1%] md:text-[10px]">AN OPEN INVITATION<br/>TO BUILD WHAT’S NEXT</div></section>
    </main>

    <footer className="grid grid-cols-1 items-center gap-[11px] px-[7%] py-8 md:grid-cols-[1fr_1fr_2fr] md:gap-5 md:px-[7.1%] md:pb-[25px] md:pt-[39px]"><a className="flex items-center justify-self-start" href="#top"><img src={aquariusLogo} alt="Vhennus Aquarius logo" className="aquarius-logo h-9 w-auto max-w-[150px] object-contain object-left"/></a><p className="my-1 text-[13px] italic text-[#5d6470] md:justify-self-center">A new world is a shared work.</p><div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-3 text-[9px] text-[#4d5666] md:mb-0 md:justify-end"><a href="#vision">The idea</a><a href="#principles">Our principles</a><a href="#coin">Vhenncoin</a><button className="flex items-center gap-1 border-0 bg-transparent text-[9px] text-[#CC5A2A]" onClick={() => navigate('/login')}>Member sign in <ArrowUpRight size={13}/></button></div><span className="border-t border-[#C9A86A] pt-[18px] font-mono text-[6px] tracking-[1px] text-[#6b7180] md:col-span-full md:text-[7px]">© {new Date().getFullYear()} VHENNUS &nbsp;·&nbsp; BUILT TOGETHER, EVERYWHERE</span></footer>
  </div>
}
