import { useState } from 'react';
import { Info } from 'lucide-react';

const regionData = [
  { name: 'United States', deaths: 697000, rate: 211.8, x: 15, y: 35 },
  { name: 'India', deaths: 2800000, rate: 272.5, x: 65, y: 45 },
  { name: 'China', deaths: 3540000, rate: 261.1, x: 70, y: 30 },
  { name: 'Russia', deaths: 1230000, rate: 584.0, x: 60, y: 20 },
  { name: 'Brazil', deaths: 395000, rate: 189.8, x: 30, y: 70 },
  { name: 'Germany', deaths: 340000, rate: 408.5, x: 48, y: 25 },
  { name: 'United Kingdom', deaths: 170000, rate: 253.2, x: 47, y: 22 },
  { name: 'Japan', deaths: 300000, rate: 237.6, x: 80, y: 32 },
  { name: 'Mexico', deaths: 220000, rate: 177.5, x: 18, y: 45 },
  { name: 'Australia', deaths: 52000, rate: 205.3, x: 82, y: 75 },
];

export function HeatMap() {
  const [hoveredRegion, setHoveredRegion] = useState<typeof regionData[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getColorIntensity = (rate: number) => {
    const maxRate = Math.max(...regionData.map(r => r.rate));
    const intensity = (rate / maxRate) * 100;
    
    if (intensity > 75) return '#E63946';
    if (intensity > 50) return '#FF6B6B';
    if (intensity > 25) return '#FFA07A';
    return '#FFD6A5';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#f6f6f6] to-[#E8F4FF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[#1a202c]">Global Heart Disease Impact</h2>
          <p className="text-[#718096] max-w-2xl mx-auto">
            Cardiovascular diseases claim millions of lives annually worldwide. Early detection saves lives.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-8">
            <Info className="w-5 h-5 text-[#1C6DD0]" />
            <span className="text-sm text-[#718096]">Hover over regions to see detailed statistics</span>
          </div>

          {/* World Map Visualization */}
          <div 
            className="relative w-full h-96 bg-gradient-to-br from-[#E8F4FF] to-white rounded-2xl border-2 border-[#1C6DD0]/10 overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-[#1C6DD0]"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-[#1C6DD0]"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>

            {/* Data points */}
            {regionData.map((region, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-lg animate-pulse"
                  style={{ backgroundColor: getColorIntensity(region.rate) }}
                />
              </div>
            ))}

            {/* Tooltip */}
            {hoveredRegion && (
              <div
                className="absolute bg-white rounded-xl shadow-2xl p-4 pointer-events-none z-10 border-2 border-[#1C6DD0]"
                style={{
                  left: mousePos.x + 20,
                  top: mousePos.y + 20,
                }}
              >
                <h4 className="mb-2 text-[#1a202c]">{hoveredRegion.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-[#718096]">
                    Annual Deaths: <span className="text-[#E63946]">{hoveredRegion.deaths.toLocaleString()}</span>
                  </p>
                  <p className="text-[#718096]">
                    Death Rate: <span className="text-[#E63946]">{hoveredRegion.rate} per 100K</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            <span className="text-sm text-[#718096]">Death Rate (per 100K):</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FFD6A5' }}></div>
              <span className="text-sm text-[#718096]">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FFA07A' }}></div>
              <span className="text-sm text-[#718096]">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FF6B6B' }}></div>
              <span className="text-sm text-[#718096]">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#E63946' }}></div>
              <span className="text-sm text-[#718096]">Very High</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
