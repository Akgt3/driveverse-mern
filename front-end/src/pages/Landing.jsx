import { useState } from "react";
import { FiSearch as SearchIcon } from "react-icons/fi";
import { RiHeartAddFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { news } from "../data/news";
import { useEffect } from "react";
import { getAllListings } from "../services/listingService";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import CarCardSkeleton from "../components/CarCardSkeleton";
export default function Landing() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchPool = listings.flatMap(car => [
    { id: `${car._id}-title`, label: car.title },
    car.brand && { id: `${car._id}-brand`, label: car.brand },
    car.model && { id: `${car._id}-model`, label: car.model },
  ]).filter(Boolean);

  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  useEffect(() => {
    if (urlSearch) {
      setQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAllListings();

        // 🔥 SHUFFLE + PICK 3
        const randomThree = [...data]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setListings(randomThree);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">

      {/* ================= HERO ================= */}
      <section className="relative h-[500px] overflow-visible">

        {/* Background image */}
        <img
          src="https://www.team-bhp.com/forum/attachments/international-automotive-scene/2182858d1627026052-bmw-ad-banned-due-irresponsible-engine-revving-sound-bmwm5competition.jpg://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600"
          alt="cars"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero content */}
        <div className="absolute inset-x-0 top-0 z-10">
          <div className="max-w-[1400px] mx-auto px-6 pt-20 sm:pt-28">
            <p className="text-neutral-300 text-sm tracking-wide mb-3">
              Welcome to <span className="text-white font-medium">DriveVerse</span>
            </p>

            <h1 className="text-white text-[34px] sm:text-[44px] lg:text-[56px] font-semibold leading-tight max-w-[680px]">
              Smarter car decisions,
              <br className="hidden sm:block" />
              built on trust and clarity
            </h1>

            <p className="mt-5 text-neutral-300 text-sm sm:text-base max-w-[560px] max-[457px]:hidden">
              A modern automotive platform to discover, compare, and list vehicles
              from verified individuals and trusted dealers.
            </p>
          </div>
        </div>






        {/* ================= FLOATING SEARCH BAR ================= */}
        {/* ================= FLOATING SEARCH BAR ================= */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-64px] z-20 w-full px-3 sm:px-4">
          <div className="
  mx-auto max-w-[1100px]
  bg-white dark:bg-[#0F0F0F]
  rounded-2xl shadow-lg
">



            {/* ================= TOP ROW ================= */}
            <div
              className="flex items-center h-[64px] px-6
    border-b border-gray-200 dark:border-[#1F1F1F]
    overflow-hidden"
            >
              {/* Browse */}
              <div className="relative flex items-center h-full px-4 text-[15px] font-semibold text-black dark:text-white mr-6 cursor-pointer">
                Browse
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-black dark:bg-white" />
              </div>

              {/* Popular */}
              {/* Popular Car Suggestions */}
              <div className="
  flex items-center gap-3 px-4 sm:ml-2
  text-[13px] sm:text-[14px]
  max-[672px]:gap-2
">

                <span className="
    text-gray-500 dark:text-gray-400
    max-[669px]:text-[10px]
  ">

                  Popular:
                </span>

                <div className="flex flex-wrap items-center gap-2 max-[507px]:gap-1.5">
                  {["BMW M3", "Ghost", "Mustang"].map((car) => (
                    < div
                      key={car}
                      onClick={() => {
                        navigate(`/buy?search=${encodeURIComponent(car)}`);
                      }}
                      className="
                  px-3 py-1 rounded-full
                  bg-gray-100 text-gray-800
                  hover:bg-gray-200 transition cursor-pointer

                  max-[669px]:px-1
                  max-[669px]:py-[2px]
                  max-[669px]:text-[10px]
                  "
                    >
                      {car}
                    </div>
                  ))}
                </div>
              </div>

              {/* List Your Car */}
              <div className="hidden sm:flex ml-auto items-center gap-2 text-[15px] font-medium text-black dark:text-white">
                List Your Car
                <span className="bg-black text-white dark:bg-white dark:text-black text-[11px] px-2 py-[3px] rounded">
                  FREE
                </span>
              </div>
            </div>











            {/* ================= SEARCH ROW ================= */}
            <div
              className="flex flex-col sm:flex-row sm:items-center
                 gap-4 px-6 py-4 sm:py-0 sm:h-[72px]"
            >

              {/* All Car Types */}
              {/* Search Scope Hint */}
              {/* LEFT SLOT REPLACEMENT */}
              {/* Trust Hint */}
              <div className="flex items-center text-[12px] sm:text-[13px] text-gray-500">
                Verified listings · Trusted sellers
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-gray-300" />

              {/* Search Input */}
              <div
                className="relative flex items-center gap-3 flex-1
    text-gray-400 border sm:border-none
    border-gray-200 rounded-lg sm:rounded-none
    px-3 sm:px-0 h-[44px] sm:h-auto"
              >
                <span className="text-lg"><SearchIcon className="w-5 h-10" /></span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by make, model, or city"
                  className="w-full outline-none text-[15px] placeholder-gray-400"
                />
                {query && (
                  <div
                    className="
      absolute top-[48px] left-0 right-0 z-50
      bg-white dark:bg-[#0F0F0F]
      border border-gray-200 dark:border-[#333333]
      rounded-xl shadow-xl
      max-h-[260px] overflow-y-auto
    "
                  >
                    {searchPool
                      .filter(item =>
                        item.label.toLowerCase().includes(query.toLowerCase())
                      )
                      .slice(0, 6)
                      .map(item => (
                        <button
                          key={item.id}
                          onClick={() =>
                            navigate(`/buy?search=${encodeURIComponent(item.label)}`)
                          }
                          className="
            w-full px-4 py-3 text-left text-sm
            text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-[#1A1A1A]
            transition
          "
                        >
                          {item.label}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  if (!query.trim()) return;
                  navigate(`/buy?search=${encodeURIComponent(query)}`);
                }}
                className="bg-black text-white text-[15px] font-medium
     w-full sm:w-auto px-10 h-[44px]
     rounded-xl hover:bg-[#111] transition
     dark:bg-white dark:text-black
     dark:hover:bg-gray-200 dark:hover:text-black"
              >
                Search Cars
              </button>
            </div>

            {/* ================= MOBILE FOOTER ================= */}
            {/* ================= MOBILE FOOTER ================= */}
            <div className="sm:hidden  px-5 py-3 flex items-center justify-between">
              <div className="text-[13px] text-gray-500">
              </div>

              <button className="text-[14px] font-medium text-black dark:text-white px-3 py-1 flex items-center gap-2">
                List Your Car
                <span className="bg-black text-white dark:bg-white dark:text-black text-[11px] px-2 py-[3px] rounded">
                  FREE
                </span>
              </button>
            </div>

          </div>
        </div>
      </section >




















      {/* Spacer for floating card */}
      < div className="h-[140px]" />








      {/* ================= TOP PICKS ================= */}

      <div className=" py-6" >
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold text-[#1F2933] dark:text-white">
              Top Picks for You
            </h2>
            <p className="mt-1 text-[14px] text-[#6B7280] dark:text-gray-400">
              Verified listings from trusted sellers
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))
              : listings.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
          </div>













          {/* See more */}
          {/* See More */}
          <div className="mt-10 text-center">
            <Link
              to="/buy"
              className="
      inline-block
      px-10 py-3
      border border-black dark:border-white
      text-black dark:text-white
      hover:bg-black hover:text-white
      dark:hover:bg-white dark:hover:text-black
      transition
    "
            >
              View More Listings
            </Link>
          </div>

        </div>
      </div>














      <section className="py-2">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Heading */}
          <div className="mb-16">
            <h2 className="text-[36px] font-semibold text-[#1F2933] dark:text-white">
              Latest Insights & Tips
            </h2>
            <p className="mt-3 text-[16px] text-[#6B7280] dark:text-gray-400 max-w-[520px]">
              Stay informed with car buying guides, maintenance tips, and auto news.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {news.slice(0, 3).map((item) => (
              <div key={item.id}>
                <div className="rounded-2xl overflow-hidden mb-5">
                  <img
                    src={item.image}
                    className="w-full h-[260px] object-cover"
                    alt={item.title}
                  />
                </div>

                <h3 className="text-[18px] font-semibold text-[#1F2933] dark:text-gray-100 mb-2">
                  {item.title}
                </h3>

                <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-[24px] mb-4">
                  {item.excerpt}
                </p>

                <Link
                  to={`/news/${item.id}`}
                  className="
              text-gray-600 dark:text-gray-400
              text-[14px] font-medium
              flex items-center gap-2
              hover:gap-3 transition-all
            "
                >
                  Read More
                  <span className="text-[16px]">›</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>






      {/* ================= MINIMAL TESTIMONIAL ================= */}
      {/* ================= PREMIUM TESTIMONIAL ================= */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">

          {/* Section header */}
          <div className="mb-14">
            <p className="text-[12px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">
              Customer experience
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            {/* LEFT — Quote */}
            <blockquote className="text-black dark:text-white">
              <p className="text-[24px] sm:text-[30px] leading-[36px] sm:leading-[44px] font-medium">
                “This didn’t feel like browsing a marketplace.
                It felt like having clarity.
                Every listing was honest, clean, and easy to trust.”
              </p>

              {/* Profile */}
              <div className="mt-10 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300"
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="text-[15px] font-medium text-black dark:text-white">
                    Alex Johnson
                  </p>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Purchased a Porsche · Kerala
                  </p>
                </div>
              </div>
            </blockquote>

            {/* RIGHT — Context */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-8 md:pl-12">
              <p className="text-[14px] leading-[26px] text-gray-600 dark:text-gray-400 max-w-[420px]">
                We focus on transparency, verified sellers,
                and thoughtful design — so buying or selling
                a car feels calm, not stressful.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div >

  );
}







