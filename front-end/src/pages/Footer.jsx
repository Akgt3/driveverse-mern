
import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#333333]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <Link to="/" className="leading-none">
              <p className="text-[18px] font-semibold tracking-wide text-black dark:text-white">
                Drive
              </p>
              <p className="text-[18px] font-semibold tracking-wide -mt-1 text-black dark:text-white">
                VERSE
              </p>
            </Link>


            <p className="mt-4 text-[14px] text-gray-600 dark:text-gray-400 leading-6 max-w-[280px]">
              A modern platform to browse, list, and discover cars with clarity,
              trust, and simplicity.
            </p>
          </div>

          {/* NAV */}
          <div>
            <h4 className="text-[14px] font-medium text-black dark:text-white mb-4">
              Explore
            </h4>

            <ul className="space-y-3 text-[14px] text-gray-600 dark:text-gray-400">
              {[
                "Buy Cars",
                "Sell Your Car",
                "Reviews",
                "News",
                "About Us",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer hover:text-black dark:hover:text-white
 transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-[14px] font-medium text-black dark:text-white mb-4">
              Company
            </h4>

            <ul className="space-y-3 text-[14px] text-gray-600 dark:text-gray-400">
              <li className="hover:text-black dark:hover:text-white
cursor-pointer transition">
                Privacy Policy
              </li>
              <li className="hover:text-black dark:hover:text-white
 cursor-pointer transition">
                Terms of Service
              </li>
              <li className="hover:text-black dark:hover:text-white
 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM — LEFT ALIGNED */}
        <div className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-[13px] text-gray-500">
            <p>© {new Date().getFullYear()} duPont Registry</p>
            <p>Designed for clarity · Built with care</p>
          </div>
        </div>

      </div>
    </footer>
  );
}



