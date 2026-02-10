import { FiX } from "react-icons/fi";
import FilterSidebar from "./FilterSidebar";

export default function MobileFilterDrawer({
  onClose,
  filters,
  setFilters,
  options
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* DRAWER */}
      <div className="
        absolute right-0 top-0
        h-full w-[340px]
        bg-white dark:bg-[#0F0F0F]
        shadow-xl
        flex flex-col
      ">
        {/* HEADER */}
        <div className="
          flex items-center justify-between px-5 py-4
          border-b border-gray-200 dark:border-[#1F1F1F]
        ">
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Filters
          </h3>
          <button onClick={onClose}>
            <FiX className="text-black dark:text-neutral-400" size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FilterSidebar
            mobile
            filters={filters}
            setFilters={setFilters}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}
