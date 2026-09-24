/** Heading block shared by the home page sections. */
export function SectionHeading({ title, note }: { title: string; note?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-10 mb-12 md:mb-16 pb-6 border-b border-outline-variant">
      <h2 className="display text-on-surface text-[clamp(2.2rem,5vw,4rem)]">{title}</h2>
      {note && <p className="max-w-md text-on-surface-variant md:text-right">{note}</p>}
    </div>
  );
}
