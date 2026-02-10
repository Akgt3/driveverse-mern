import {
  FiHelpCircle,
  FiMail,
  FiShield,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

export default function Help() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[1100px] mx-auto px-6 py-16">

        {/* HEADER */}
        <h1 className="text-[36px] font-semibold text-black dark:text-white">
          Help & Support
        </h1>
        <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 max-w-[720px]">
          Find answers to common questions or reach out to DriveVerse support.
          We’re here to help you buy and sell with confidence.
        </p>

        {/* HELP SECTIONS */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">

          <HelpCard
            icon={<FiFileText />}
            title="Posting & Managing Ads"
            desc="How to create listings, edit ads, mark vehicles as sold, or delete posts."
            items={[
              "Go to Sell page to post a new car",
              "Use My Ads to edit or delete listings",
              "Mark ads as sold anytime",
            ]}
          />

          <HelpCard
            icon={<FiUsers />}
            title="Account & Profile"
            desc="Manage your DriveVerse account and profile settings."
            items={[
              "Login using email or Google",
              "Update profile details",
              "Secure logout from all devices",
            ]}
          />

          <HelpCard
            icon={<FiShield />}
            title="Safety & Verification"
            desc="Learn how DriveVerse keeps buyers and sellers safe."
            items={[
              "Verified seller badges",
              "No fake listings policy",
              "Report suspicious activity",
            ]}
          />

          <HelpCard
            icon={<FiHelpCircle />}
            title="Buying Cars"
            desc="Everything you need to know before contacting a seller."
            items={[
              "View detailed car listings",
              "Chat directly with sellers",
              "Save cars to wishlist",
            ]}
          />
        </div>

        {/* CONTACT */}
        <div
          className="
            mt-16
            bg-white dark:bg-[#0F0F0F]
            border border-gray-200 dark:border-[#333333]
            rounded-lg
            p-6
          "
        >
          <div className="flex items-start gap-4">
            <div className="text-black dark:text-white">
              <FiMail size={22} />
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-black dark:text-white">
                Still need help?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Contact our support team and we’ll get back to you as soon as
                possible.
              </p>

              <p className="mt-3 text-sm text-black dark:text-white font-medium">
                support@driveverse.com
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENT ---------- */

function HelpCard({ icon, title, desc, items }) {
  return (
    <div
      className="
        p-6 rounded-lg
        bg-white dark:bg-[#0F0F0F]
        border border-gray-200 dark:border-[#333333]
        transition
      "
    >
      <div className="flex items-center gap-3 text-black dark:text-white">
        {icon}
        <h3 className="text-[16px] font-semibold">{title}</h3>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        {desc}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
