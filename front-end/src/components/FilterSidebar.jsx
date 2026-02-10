import { FiChevronDown } from "react-icons/fi";

export default function FilterSidebar({ mobile = false, filters, setFilters, options }) {

  return (
    <aside
      className={`
        ${mobile ? "" : "w-full"}
        bg-white dark:bg-[#0F0F0F]
        border border-gray-200 dark:border-[#333333]
        rounded-lg
        p-5 space-y-6 shadow-sm
      `}
    >
      <Header title="CATEGORIES" />
      <button
        onClick={() =>
          setFilters({
            location: "",
            brand: "",
            model: "",
            fuel: "",
            transmission: "",
            owners: "",
            yearFrom: "",
            yearTo: "",
            minPrice: 0,
            maxPrice: 500000000,
          })
        }
        className="
    w-full text-sm py-2 text-black dark:text-white  dark:bg-[#0F0F0F]
    border border-gray-300 dark:border-[#333333] 
    rounded-md
hover:bg-gray-100 dark:hover:bg-[#1A1A1A] "
      >
        Clear all filters
      </button>

      <Block title="Location">
        <SelectBox
          placeholder="Select location"
          value={filters.location}
          options={options.locations}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, location: v }))
          }
        />
      </Block>

      <Block title="Brand">
        <SelectBox
          placeholder="Select brand"
          value={filters.brand}
          options={options.brands}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, brand: v }))
          }
        />
      </Block>
      <Block title="Model">
        <SelectBox
          placeholder="Select model"
          value={filters.model}
          options={options.models}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, model: v }))
          }
        />
      </Block>

















      <Block title="Price">
        <input
          type="range"
          min={0}
          max={500000000}
          step={50000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          style={{
            background: `linear-gradient(
        to right,
        ${document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"} 0%,
        ${document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"} ${(filters.maxPrice / 500000000) * 100
              }%,
        ${document.documentElement.classList.contains("dark") ? "#2a2a2a" : "#e5e7eb"} ${(filters.maxPrice / 500000000) * 100
              }%,
        ${document.documentElement.classList.contains("dark") ? "#2a2a2a" : "#e5e7eb"} 100%
      )`,
          }}
          className="
      w-full h-[4px]
      appearance-none
      rounded-full
      cursor-pointer
    "
        />

        <div className="flex justify-between text-xs mt-2">
          <span className="text-gray-500 dark:text-gray-400">₹0</span>
          <span className="text-gray-500 dark:text-gray-400">
            ₹{filters.maxPrice.toLocaleString()}
          </span>
        </div>
      </Block>


















      <Block title="Year">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.minYear || ""}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                minYear: e.target.value,
              }))
            }
            className="
        w-full px-3 py-2 text-sm
        rounded-md
        border border-gray-300 dark:border-[#333333]
        bg-white dark:bg-[#121212]
        text-gray-700 dark:text-gray-300
      "
          />

          <span className="self-center text-gray-500 dark:text-gray-400">
            to
          </span>

          <input
            type="number"
            placeholder="To"
            value={filters.maxYear || ""}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                maxYear: e.target.value,
              }))
            }
            className="
        w-full px-3 py-2 text-sm
        rounded-md
        border border-gray-300 dark:border-[#333333]
        bg-white dark:bg-[#121212]
        text-gray-700 dark:text-gray-300
      "
          />
        </div>
      </Block>

      <Block title="Transmission">
        <SelectBox
          placeholder="Select transmission"
          value={filters.transmission}
          options={options.transmissions}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, transmission: v }))
          }
        />
      </Block>

      <Block title="No. of Owners">
        <Pills
          items={options.owners}
          active={filters.owners}
          onSelect={(v) =>
            setFilters(prev => ({ ...prev, owners: v }))
          }
        />
      </Block>

      <Block title="Fuel">
        <SelectBox
          placeholder="Select fuel"
          value={filters.fuel}
          options={options.fuels}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, fuel: v }))
          }
        />
      </Block>
      <Block title="Kilometers Driven">
        <SelectBox
          placeholder="Select km range"
          value={filters.kmRange}
          options={options.kmRanges}
          onChange={(v) =>
            setFilters(prev => ({ ...prev, kmRange: v }))
          }
        />
      </Block>
    </aside>
  );
}

/* ---------- INTERNAL ---------- */

function Header({ title }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-black dark:text-white">
        {title}
      </h3>
      <FiChevronDown className="text-gray-500 dark:text-neutral-500" />
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="border-t border-gray-200 dark:border-[#333333] pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-black dark:text-white">
          {title}
        </h4>
        <FiChevronDown className="text-gray-500 dark:text-neutral-500" />
      </div>
      {children}
    </div>
  );
}

function SelectBox({ value, options = [], placeholder, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-[42px]
          pl-3 pr-10
          text-sm
          rounded-md
          border border-gray-300 dark:border-[#333333]
          bg-white dark:bg-[#121212]
          text-black dark:text-white
          appearance-none
        "
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <FiChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2
          text-gray-400 pointer-events-none"
      />
    </div>
  );
}

function InputBox({ value }) {
  return (
    <input
      readOnly
      value={value}
      className="
        w-full px-3 py-2 text-sm rounded-md
        border border-gray-300 dark:border-[#333333]
        bg-white dark:bg-[#121212]
        text-black dark:text-white
      "
    />
  );
}

function Pills({ items = [], active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(active === item ? "" : item)}
          className={`
            px-3 py-1.5 text-sm rounded-md border
            ${active === item
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white dark:bg-[#121212] text-black dark:text-white"
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function RangeBar() {
  return (
    <div className="relative h-2 bg-gray-200 dark:bg-[#1F1F1F] rounded">
      <div className="absolute inset-0 bg-black dark:bg-white rounded" />

      <span className="
        absolute -left-1 -top-1
        w-4 h-4
        bg-white dark:bg-[#0A0A0A]
        border border-black dark:border-white
        rounded-full
      " />

      <span className="
        absolute -right-1 -top-1
        w-4 h-4
        bg-white dark:bg-[#0A0A0A]
        border border-black dark:border-white
        rounded-full
      " />
    </div>
  );
}
