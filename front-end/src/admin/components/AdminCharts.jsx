import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = {
  verified: "#16a34a",
  unverified: "#9ca3af",
  featured: "#eab308",
  regular: "#9ca3af",
};

export default function AdminCharts({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ THEME-AWARE COLORS
  const axisColor = isDark ? "#9CA3AF" : "#374151";
  const gridColor = isDark ? "#333333" : "#E5E7EB";
  const tooltipBg = isDark ? "#1F1F1F" : "#FFFFFF";
  const tooltipBorder = isDark ? "#333333" : "#E5E7EB";
  const tooltipText = isDark ? "#FFFFFF" : "#000000";
  const lineColor = isDark ? "#FFFFFF" : "#000000";
  const barColor = isDark ? "#FFFFFF" : "#000000";

  // Mock user growth data
  const userData = [
    { month: "Jan", users: Math.floor(stats.totalUsers * 0.5) },
    { month: "Feb", users: Math.floor(stats.totalUsers * 0.6) },
    { month: "Mar", users: Math.floor(stats.totalUsers * 0.75) },
    { month: "Apr", users: Math.floor(stats.totalUsers * 0.9) },
    { month: "May", users: stats.totalUsers },
  ];

  const listingData = [
    { name: "Total", value: stats.totalListings },
    { name: "Featured", value: stats.featuredListings },
  ];

  const verificationData = [
    { name: "Verified", value: stats.verifiedListings },
    {
      name: "Unverified",
      value: stats.totalListings - stats.verifiedListings,
    },
  ];

  // ✅ CUSTOM TOOLTIP WITH DARK MODE SUPPORT
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            color: tooltipText,
          }}
        >
          {label && <p className="font-medium text-sm">{label}</p>}
          {payload.map((entry, index) => (
            <p key={index} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Analytics
        </h2>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* ✅ USER GROWTH - FIXED DARK MODE */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-6">
          <h3 className="text-sm font-medium text-black dark:text-white mb-4">
            User Growth
          </h3>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="month"
                  stroke={axisColor}
                  tick={{ fill: axisColor }}
                />
                <YAxis
                  stroke={axisColor}
                  tick={{ fill: axisColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={{ fill: lineColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ LISTINGS BAR CHART - FIXED DARK MODE */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-6">
          <h3 className="text-sm font-medium text-black dark:text-white mb-4">
            Listings Overview
          </h3>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="name"
                  stroke={axisColor}
                  tick={{ fill: axisColor }}
                />
                <YAxis
                  stroke={axisColor}
                  tick={{ fill: axisColor }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill={barColor}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ VERIFICATION PIE CHART - ALREADY WORKS IN DARK MODE */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-6">
          <h3 className="text-sm font-medium text-black dark:text-white mb-4">
            Listing Verification
          </h3>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {verificationData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.name === "Verified"
                          ? COLORS.verified
                          : COLORS.unverified
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex justify-center gap-4 text-xs text-black dark:text-white">
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.verified }}
              />
              Verified
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.unverified }}
              />
              Unverified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}