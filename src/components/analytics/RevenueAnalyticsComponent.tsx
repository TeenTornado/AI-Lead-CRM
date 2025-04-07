import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  DollarSign,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSignIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  TooltipProps,
} from "recharts";
import { ErrorBoundary } from "react-error-boundary";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RevenueMetrics {
  mrr: number;
  arr: number;
  forecast: number[];
  sources: Record<string, number>;
}

interface RevenueAnalyticsProps {
  metrics: RevenueMetrics;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

// Custom color palette that works in both light and dark mode
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];
const COLORS_DARK = [
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#F87171",
  "#A78BFA",
  "#F472B6",
];

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    <h3 className="text-lg font-medium text-red-800 dark:text-red-200 flex items-center">
      <span className="bg-red-100 dark:bg-red-800 p-1 rounded mr-2">⚠️</span>
      Analytics Error
    </h3>
    <p className="mt-3 text-sm text-red-700 dark:text-red-300">
      {error.message}
    </p>
    <Button
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800/50 dark:hover:bg-red-800 dark:text-red-200"
    >
      Reload Analytics
    </Button>
  </div>
);

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  prefix?: string;
  icon: React.ReactNode;
  gradientColor?: string;
  description?: string;
}

const MetricCard = React.memo(
  ({
    title,
    value,
    change,
    prefix = "$",
    icon,
    gradientColor = "blue",
    description,
  }: MetricCardProps) => {
    const getGradient = () => {
      switch (gradientColor) {
        case "purple":
          return "from-purple-500/20 to-purple-500/5 dark:from-purple-500/10";
        case "green":
          return "from-green-500/20 to-green-500/5 dark:from-green-500/10";
        case "amber":
          return "from-amber-500/20 to-amber-500/5 dark:from-amber-500/10";
        default:
          return "from-blue-500/20 to-blue-500/5 dark:from-blue-500/10";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-hover"
      >
        <Card className="border-0 shadow-md overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${getGradient()} rounded-bl-full opacity-70`}
          ></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {prefix}
                  {value.toLocaleString()}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {description}
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full text-${gradientColor}-500 dark:text-${gradientColor}-400 bg-gray-100 dark:bg-gray-800`}
              >
                {icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  change > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                )}
              >
                {change > 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

MetricCard.displayName = "MetricCard";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />
      ))}
    </div>
    <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />
  </div>
);

// Custom tooltip component for charts
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {`${entry.name}: $${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom pie chart label
interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomizedLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      className="fill-gray-700 dark:fill-gray-300"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const RevenueAnalyticsComponent: React.FC<RevenueAnalyticsProps> = ({
  metrics,
  isLoading,
  onError,
}) => {
  const { theme } = useTheme();
  const chartColors = theme === "dark" ? COLORS_DARK : COLORS;

  const forecastData = useMemo(
    () => [
      {
        month: "Jan",
        revenue: metrics.forecast[0],
        target: metrics.forecast[0] * 1.1,
      },
      {
        month: "Feb",
        revenue: metrics.forecast[1],
        target: metrics.forecast[1] * 1.1,
      },
      {
        month: "Mar",
        revenue: metrics.forecast[2],
        target: metrics.forecast[2] * 1.1,
      },
      {
        month: "Apr",
        revenue: metrics.forecast[3],
        target: metrics.forecast[3] * 1.1,
      },
      {
        month: "May",
        revenue: metrics.forecast[4],
        target: metrics.forecast[4] * 1.1,
      },
      {
        month: "Jun",
        revenue: metrics.forecast[5],
        target: metrics.forecast[5] * 1.1,
      },
    ],
    [metrics.forecast]
  );

  const sourceData = useMemo(
    () =>
      Object.entries(metrics.sources).map(([name, value]) => ({
        name,
        value,
      })),
    [metrics.sources]
  );

  // Calculate QoQ growth
  const currentQuarter = metrics.forecast
    .slice(0, 3)
    .reduce((sum, val) => sum + val, 0);
  const prevQuarter = currentQuarter * 0.92; // Simulated previous quarter data
  const qoqGrowth = ((currentQuarter - prevQuarter) / prevQuarter) * 100;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      <div className="space-y-8">
        {/* Header with title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-blue-500" /> Revenue
            Analytics
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={metrics.mrr}
            change={8.2}
            description="Current month's recurring revenue"
            icon={<DollarSign className="h-8 w-8" />}
            gradientColor="blue"
          />
          <MetricCard
            title="Annual Recurring Revenue"
            value={metrics.arr}
            change={12.5}
            description="Projected annual revenue"
            icon={<TrendingUp className="h-8 w-8" />}
            gradientColor="purple"
          />
          <MetricCard
            title="Quarter over Quarter"
            value={currentQuarter}
            change={Number(qoqGrowth.toFixed(1))}
            description="QoQ growth rate"
            icon={<BarChartIcon className="h-8 w-8" />}
            gradientColor="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Forecast */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="flex items-center text-lg font-medium">
                <LineChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                Revenue Forecast
                <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
              </CardTitle>
              <CardDescription>
                6-month revenue projection with targets
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ccc"
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke={chartColors[0]}
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target"
                      stroke={chartColors[1]}
                      strokeDasharray="5 5"
                      dot={false}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Sources */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="flex items-center text-lg font-medium">
                <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
                Revenue Sources
                <div className="ml-2 h-2 w-2 rounded-full bg-purple-500"></div>
              </CardTitle>
              <CardDescription>
                Distribution of revenue across channels
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      className="stroke-white dark:stroke-gray-800"
                      strokeWidth={2}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `$${value.toLocaleString()}`
                      }
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => (
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="flex items-center text-lg font-medium">
              <BarChartIcon className="mr-2 h-5 w-5 text-green-500" />
              Monthly Revenue Breakdown
              <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
            </CardTitle>
            <CardDescription>
              Comparison of actual vs target revenue by month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ccc"
                    opacity={0.1}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 20 }}
                    formatter={(value) => (
                      <span className="text-sm font-medium">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Actual Revenue"
                    fill={chartColors[0]}
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    dataKey="target"
                    name="Target Revenue"
                    fill={chartColors[1]}
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap justify-between items-center w-full text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Actual Revenue
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Target Revenue
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                <DownloadIcon className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

// DownloadIcon component
const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default React.memo(RevenueAnalyticsComponent);
