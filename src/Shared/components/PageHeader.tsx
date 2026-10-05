interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
}

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="border-b border-[#C9A86A] pb-6">
      {eyebrow && (
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[.15em] text-[#CC5A2A]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-[clamp(28px,4vw,40px)] leading-[1.05] tracking-[-.03em] text-[#0A1931]">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-md text-[15px] leading-[1.7] text-[#4d5666]">
          {description}
        </p>
      )}
    </div>
  )
}
