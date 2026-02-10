import { useState } from "react";
import { FiSliders, FiSearch } from "react-icons/fi";
import CarCard from "../components/CarCard";
import FilterSidebar from "../components/FilterSidebar";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import { useEffect } from "react";
import { getAllListings } from "../services/listingService";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import CarCardSkeleton from "../components/CarCardSkeleton";


export default function Buy() {
  const [openFilters, setOpenFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  useEffect(() => {
    if (urlSearch) {
      setQuery(urlSearch);
    }
  }, [urlSearch]);

  const searchPool = listings.flatMap(car => [
    { id: `${car._id}-title`, label: car.title },
    car.brand && { id: `${car._id}-brand`, label: car.brand },
    car.model && { id: `${car._id}-model`, label: car.model },
  ]).filter(Boolean);

  const [filters, setFilters] = useState({
    location: "",
    brand: "",
    model: "",
    fuel: "",
    transmission: "",
    owners: "",
    minYear: "",
    maxYear: "",
    priceMax: "",
    minPrice: 0,
    maxPrice: 500000000,
    kmRange: "",

  });
  const kmRanges = [
    "0-20000",
    "20000-50000",
    "50000-100000",
    "100000+",
  ];

  const normalize = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : v;


  const filteredBase = listings.filter(car =>
    !filters.location ||
    normalize(car.location) === normalize(filters.location)
  );

  const uniqueFrom = (arr, key) =>
    [...new Set(arr.map(item => item[key]).filter(Boolean))];

  const locations = uniqueFrom(listings, "location");
  const brands = uniqueFrom(filteredBase, "brand");
  const models = uniqueFrom(filteredBase, "model");
  const fuels = uniqueFrom(filteredBase, "fuel");
  const transmissions = uniqueFrom(filteredBase, "transmission");
  const ownersList = uniqueFrom(filteredBase, "owners");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAllListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.key, location.state]);


  const matchesSearch = (car, q) => {
    if (!q) return true;
    const query = q.toLowerCase();

    return (
      car.title?.toLowerCase().includes(query) ||
      car.brand?.toLowerCase().includes(query) ||
      car.model?.toLowerCase().includes(query) ||
      car.location?.toLowerCase().includes(query)
    );
  };

  const filteredCars = listings
    .filter(car => matchesSearch(car, query))
    .filter(car =>
      !filters.location || normalize(car.location) === normalize(filters.location)
    )
    .filter(car =>
      !filters.brand || normalize(car.brand) === normalize(filters.brand)
    )
    .filter(car =>
      !filters.model || normalize(car.model) === normalize(filters.model)
    )
    .filter(car =>
      !filters.fuel || normalize(car.fuel) === normalize(filters.fuel)
    )
    .filter(car =>
      !filters.transmission || normalize(car.transmission) === normalize(filters.transmission)
    )
    .filter(car =>
      !filters.owners || normalize(car.owners) === normalize(filters.owners)
    )
    .filter(car => {
      const year = Number(car.year);
      return (!filters.minYear || year >= filters.minYear) &&
        (!filters.maxYear || year <= filters.maxYear);
    })
    .filter(car => {
      const price = Number(car.price.replace(/[^0-9]/g, ""));
      return price <= filters.maxPrice;
    })
    .filter(car => {
      if (!filters.kmRange) return true;
      const km = Number(car.km);
      if (filters.kmRange === "0-20000") return km <= 20000;
      if (filters.kmRange === "20000-50000") return km > 20000 && km <= 50000;
      if (filters.kmRange === "50000-100000") return km > 50000 && km <= 100000;
      if (filters.kmRange === "100000+") return km > 100000;
      return true;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20">

      {/* ✅ MOBILE-FIRST CONTAINER */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">

        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Cars for Sale
          </h2>

          <button
            onClick={() => setOpenFilters(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-black text-white dark:bg-white dark:text-black
              text-sm font-medium"
          >
            <FiSliders size={16} />
            Filters
          </button>
        </div>

        {/* ✅ RESPONSIVE LAYOUT */}
        <div className="flex gap-8">

          {/* DESKTOP FILTER */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                options={{
                  locations,
                  brands,
                  models,
                  fuels,
                  transmissions,
                  owners: ownersList, // ✅ THIS WAS MISSING
                  kmRanges,
                }}
              />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="flex-1 min-w-0">

            {/* SEARCH BAR */}
            <div className="relative mb-6">
              <div className="
                flex items-center gap-3
                bg-white dark:bg-[#0F0F0F]
                border border-gray-200 dark:border-[#333333]
                rounded-lg px-4 py-3
              ">
                <FiSearch className="text-gray-400" size={18} />

                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search by brand or model"
                  className="flex-1 bg-transparent outline-none text-sm
                    text-black dark:text-white"
                />

                <button
                  onClick={() => {
                    setSearchTerm(query.trim());
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 rounded-md text-sm font-medium
    bg-black text-white dark:bg-white dark:text-black"
                >
                  Search
                </button>
              </div>

              {/* SUGGESTIONS */}
              {showSuggestions && query && (
                <div className="absolute z-20 mt-2 w-full bg-white dark:bg-[#0F0F0F]
                  border border-gray-200 dark:border-[#333333]
                  rounded-lg overflow-hidden shadow-lg">
                  {searchPool
                    .filter(item =>
                      item.label.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 6)
                    .map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setQuery(item.label);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm
                          hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* ✅ MOBILE-CENTERED CARD GRID */}
            <div className="
              grid grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-5
              place-items-center sm:place-items-stretch
            ">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))
              ) : filteredCars.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    No vehicles found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try a different search or clear filters
                  </p>
                </div>
              ) : (
                filteredCars.map(car => (
                  <div key={car._id} className="w-full max-w-[360px]">
                    <CarCard car={car} />
                  </div>
                ))
              )}
            </div>

          </section>
        </div>
      </div>

      {openFilters && (
        <MobileFilterDrawer
          onClose={() => setOpenFilters(false)}
          filters={filters}
          setFilters={setFilters}
          options={{
            locations,
            brands,
            models,
            fuels,
            transmissions,
            owners: ownersList,
          }}
        />
      )}
    </div>
  );
}
