type CategoryCardProps = {
  description: string;
  icon: string;
  title: string;
};

export function CategoryCard({
  description,
  icon,
  title,
}: CategoryCardProps) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-white/[0.06]">
      <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-300/10 text-xl ring-1 ring-inset ring-emerald-300/20">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
