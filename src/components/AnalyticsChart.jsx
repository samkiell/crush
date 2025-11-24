import { useEffect, useRef } from 'react';

const AnalyticsChart = ({ data, type = 'bar' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const ctx = canvasRef.current.getContext('2d');

    // derive theme-aware colors from CSS variables where possible
    const computed = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const primaryColor = (computed && computed.getPropertyValue('--p')) || '#3B82F6';
    const textColor = (computed && computed.getPropertyValue('--bc')) || '#374151';
    const palette = [primaryColor, '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

    // Simple chart implementation (in a real app, you'd use a library like Chart.js)
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (type === 'bar') {
      drawBarChart(ctx, data, width, height, palette, textColor);
    } else if (type === 'line') {
      drawLineChart(ctx, data, width, height, palette[0]);
    } else if (type === 'pie') {
      drawPieChart(ctx, data, width, height, palette);
    }
  }, [data, type]);

  const drawBarChart = (ctx, data, width, height, palette, textColor) => {
    const barWidth = width / data.length - 10;
    const maxValue = Math.max(...data.map(d => d.value));

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (height - 40);
      const x = index * (barWidth + 10) + 5;
      const y = height - barHeight - 20;

      // Draw bar
      ctx.fillStyle = palette[index % palette.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = textColor || '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 5);
    });
  };

  const drawLineChart = (ctx, data, width, height, color) => {
    ctx.strokeStyle = color || '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxValue = Math.max(...data.map(d => d.value));
    const xStep = width / (data.length - 1);

    data.forEach((item, index) => {
      const x = index * xStep;
      const y = height - 20 - (item.value / maxValue) * (height - 40);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const drawPieChart = (ctx, data, width, height, palette) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.fillStyle = palette[index % palette.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      startAngle += sliceAngle;
    });
  };

  return (
    <div className="bg-base-100 rounded-xl shadow p-6">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-auto"
      />
    </div>
  );
};

export default AnalyticsChart;
