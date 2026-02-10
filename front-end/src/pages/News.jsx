import { Link } from "react-router-dom";
import { news } from "../data/news";
export default function News() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[1200px] mx-auto px-6 py-20">

        {/* Page Title */}
        <div className="mb-16">
          <h1 className="text-[38px] font-semibold text-black dark:text-white">
            Automotive Insights
          </h1>
          <p className="mt-4 text-[15px] text-gray-600 dark:text-gray-400 max-w-[620px] leading-[28px]">
            In-depth perspectives on buying, selling, ownership, and the evolving
            automotive market — written with clarity, not noise.
          </p>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {news.map(item => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="block"
            >
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[260px] object-cover"
                />
              </div>

              <p className="text-[11px] tracking-widest uppercase text-gray-500 mb-2">
                {item.date}
              </p>

              <h3 className="text-[18px] font-semibold text-black dark:text-white mb-3 leading-[28px]">
                {item.title}
              </h3>

              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-[26px]">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
