import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackNavProp {
  title?: string
  className?: string
}

const BackNav: React.FC<BackNavProp> = ({ title, className = '' }) => {
  const navigate = useNavigate()

  return (
    <nav
      className={[
        'sticky top-0 z-40 flex h-14 w-full items-center px-4 sm:px-6',
        'border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 backdrop-blur-md',
        className,
      ].join(' ')}
    >
      <button
        onClick={() => navigate(-1)}
        className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#0A1931]/5"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5 text-[#0A1931]" />
      </button>

      {title && (
        <h1 className="ml-3 truncate font-serif text-lg text-[#0A1931]">
          {title}
        </h1>
      )}
    </nav>
  )
}

export default BackNav
