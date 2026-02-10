export default function CarCardSkeleton() {
  return (
    <div
      className="
        w-full max-w-[360px]
        border border-gray-200 dark:border-[#1F1F1F]
        rounded-lg overflow-hidden
        bg-white dark:bg-[#0F0F0F]
        animate-pulse
      "
    >
      {/* IMAGE */}
      <div className="w-full h-[190px] bg-gray-200 dark:bg-[#1F1F1F]" />

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <div className="h-5 w-24 bg-gray-200 dark:bg-[#1F1F1F] rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-[#1F1F1F] rounded" />

        <div className="flex gap-2 mt-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-[#1F1F1F] rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-[#1F1F1F] rounded" />
        </div>

        <div className="h-[38px] w-full bg-gray-200 dark:bg-[#1F1F1F] rounded mt-4" />
      </div>
    </div>
  );
}
