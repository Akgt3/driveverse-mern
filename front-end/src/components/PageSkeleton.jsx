export default function PageSkeleton({ type = "default" }) {
  if (type === "vehicle-grid") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-8">
            {/* SIDEBAR SKELETON */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </aside>

            {/* GRID SKELETON */}
            <section className="flex-1">
              <div className="h-12 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded mb-6 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (type === "vehicle-details") {
    return (
      <div className="bg-white dark:bg-[#0A0A0A] pt-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT */}
            <div className="flex-1 space-y-6">
              <div className="h-[420px] w-full bg-gray-200 dark:bg-[#1F1F1F] rounded-xl animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-[84px] h-[56px] bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse"
                  />
                ))}
              </div>
              <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-5 space-y-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[360px] space-y-5">
              <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-5 space-y-3">
                <div className="h-4 w-24 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
              </div>
              <div className="h-[180px] w-full bg-gray-200 dark:bg-[#1F1F1F] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "wishlist") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="space-y-3 mb-8">
            <div className="h-8 w-40 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "my-ads") {
    return (
      <div className="py-24 bg-white dark:bg-[#0A0A0A] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-6 space-y-2">
            <div className="h-8 w-32 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "news") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="mb-16 space-y-3">
            <div className="h-10 w-64 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-[260px] w-full bg-gray-200 dark:bg-[#1F1F1F] rounded-2xl animate-pulse" />
                <div className="h-6 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "reviews") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-18">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-14">
            <div className="space-y-3">
              <div className="h-10 w-48 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
              <div className="h-5 w-96 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#333333] rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#1F1F1F] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT SKELETON
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20 px-6 py-16">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="h-10 w-64 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse" />
        <div className="space-y-4 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full bg-gray-200 dark:bg-[#1F1F1F] rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarCardSkeleton() {
  return (
    <div className="w-full max-w-[360px] border border-gray-200 dark:border-[#1F1F1F] rounded-lg overflow-hidden bg-white dark:bg-[#0F0F0F] animate-pulse">
      <div className="w-full h-[190px] bg-gray-200 dark:bg-[#1F1F1F]" />
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