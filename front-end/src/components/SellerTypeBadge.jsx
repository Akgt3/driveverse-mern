import { FiUser, FiBriefcase } from "react-icons/fi";

export default function SellerTypeBadge({ type }) {
  const isDealer = type === "dealer";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-[3px]
        text-[11px] font-medium
        rounded-full
        border
        ${isDealer
          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
          : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:border-[#2A2A2A]"
        }
      `}
    >
      {isDealer ? <FiBriefcase size={11} /> : <FiUser size={11} />}
      {isDealer ? "Dealer" : "Individual"}
    </span>
  );
}
