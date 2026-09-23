import type { TechChip } from "@/lib/projects";

/** `card` is the larger chip on the home page cards; `article` is the compact
 *  one in a project write-up header. */
const variants = {
  card: {
    chip: "gap-2 px-3 py-1.5 bg-background/90 border-outline-variant/40 text-xs md:text-sm shadow-sm",
    category: "text-[0.7rem]",
    label: "text-on-surface font-semibold",
  },
  article: {
    chip: "gap-1.5 px-2.5 py-1 bg-surface-container-high border-outline-variant/30 text-xs",
    category: "text-[0.65rem]",
    label: "text-on-surface/90 font-medium",
  },
};

export function TechChips({
  chips,
  variant = "card",
  className = "",
}: {
  chips: TechChip[];
  variant?: keyof typeof variants;
  className?: string;
}) {
  const style = variants[variant];
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`inline-flex items-center border font-sans tracking-wide ${style.chip}`}
        >
          <span className={`text-primary font-black uppercase ${style.category}`}>{chip.category}</span>
          <span className={style.label}>{chip.label}</span>
        </span>
      ))}
    </div>
  );
}
