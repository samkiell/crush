"use client";

import React from "react";

export const MetricCard = ({ title, value, change, trend = "neutral" }) => {
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-500";
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {change && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
};

export const BarChart = ({ data, height = 200 }) => {
  // data: [{ label: string, value: number }]
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex items-end justify-center h-full">
               <div
                className="w-full bg-blue-500/80 hover:bg-blue-500 rounded-t-md transition-all duration-300 relative group-hover:shadow-lg"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {item.value}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart = ({ data, height = 200, color = "#3b82f6" }) => {
  // data: [{ label: string, value: number }]
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

        {/* The Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm"
        />
        
        {/* Area under line */}
        <polygon
          fill={color}
          fillOpacity="0.1"
          points={`0,100 ${points} 100,100`}
          vectorEffect="non-scaling-stroke"
        />

        {/* Points */}
        {data.map((d, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - (d.value / maxValue) * 100;
           return (
             <circle
               key={i}
               cx={x}
               cy={y}
               r="1.5"
               fill="white"
               stroke={color}
               strokeWidth="1"
               className="hover:r-2 transition-all cursor-pointer"
             >
               <title>{`${d.label}: ${d.value}`}</title>
             </circle>
           )
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => (
           <span key={i} className="text-xs text-gray-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
};

export const PieChart = ({ data, size = 200 }) => {
  // data: [{ label: string, value: number, color: string }]
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  let currentAngle = 0;

  if (total === 0) return <div className="text-gray-400 text-sm">No data</div>;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const x1 = 50 + 50 * Math.cos((Math.PI * currentAngle) / 180);
          const y1 = 50 + 50 * Math.sin((Math.PI * currentAngle) / 180);
          const x2 = 50 + 50 * Math.cos((Math.PI * (currentAngle + angle)) / 180);
          const y2 = 50 + 50 * Math.sin((Math.PI * (currentAngle + angle)) / 180);
          
          const largeArcFlag = percentage > 0.5 ? 1 : 0;
          
          const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          const slice = (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            >
              <title>{`${item.label}: ${item.value} (${Math.round(percentage * 100)}%)`}</title>
            </path>
          );
          
          currentAngle += angle;
          return slice;
        })}
        <circle cx="50" cy="50" r="30" fill="var(--bg-card, white)" className="dark:fill-gray-800" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <span className="text-xs font-medium text-gray-500">Total: {total}</span>
      </div>
    </div>
  );
};
