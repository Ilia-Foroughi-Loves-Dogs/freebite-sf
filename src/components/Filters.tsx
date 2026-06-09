export type ResourceFilter =
  | "All"
  | "Free"
  | "Free groceries"
  | "Free hot meals"
  | "Community fridges"
  | "Student resources"
  | "Nearby restaurants"
  | "Has cheap items"
  | "Unknown price";

export type SortOption = "Closest" | "Cheapest food" | "Free first";

const filters: ResourceFilter[] = [
  "All",
  "Free",
  "Free groceries",
  "Free hot meals",
  "Community fridges",
  "Student resources",
  "Nearby restaurants",
  "Has cheap items",
  "Unknown price",
];

const sorts: SortOption[] = ["Closest", "Cheapest food", "Free first"];

type FiltersProps = {
  activeFilter: ResourceFilter;
  activeSort: SortOption;
  openNow: boolean;
  onFilterChange: (filter: ResourceFilter) => void;
  onOpenNowChange: (openNow: boolean) => void;
  onSortChange: (sort: SortOption) => void;
};

export function Filters({
  activeFilter,
  activeSort,
  openNow,
  onFilterChange,
  onOpenNowChange,
  onSortChange,
}: FiltersProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Filter
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "border-emerald-300 bg-emerald-300 text-[#07110e]"
                  : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/25 hover:text-white"
              }`}
              key={filter}
              onClick={() => onFilterChange(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Sort
          </span>
          {sorts.map((sort) => (
            <button
              aria-pressed={activeSort === sort}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                activeSort === sort
                  ? "bg-white/10 text-emerald-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              key={sort}
              onClick={() => onSortChange(sort)}
              type="button"
            >
              {sort}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-200">
          <input
            checked={openNow}
            className="peer sr-only"
            onChange={(event) => onOpenNowChange(event.target.checked)}
            type="checkbox"
          />
          <span className="relative h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-emerald-300 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5 peer-checked:after:bg-[#07110e]" />
          Open now
        </label>
      </div>
    </div>
  );
}
