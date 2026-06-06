import { useState } from 'react';
import { countries, type Country } from '../data/countries';

interface WorldMapProps {
  nukedCountries: string[];
  onSelectCountry: (country: Country) => void;
}

export default function WorldMap({ nukedCountries, onSelectCountry }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  const handleMouseEnter = (country: Country, e: React.MouseEvent) => {
    if (nukedCountries.includes(country.id)) return;
    const svg = (e.target as SVGPathElement).closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = country.center.x;
    const svgY = country.center.y;
    // Convert SVG coordinates to screen coordinates
    const screenX = (svgX / 1000) * rect.width;
    const screenY = (svgY / 500) * rect.height;
    setTooltip({ name: country.name, x: screenX, y: screenY });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleClick = (country: Country) => {
    if (nukedCountries.includes(country.id)) return;
    onSelectCountry(country);
  };

  return (
    <div className="map-screen">
      <p className="map-screen__instruction">🎯 Select a target country</p>
      <div className="map-container">
        <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
          {/* Ocean background */}
          <rect x="0" y="0" width="1000" height="500" fill="var(--bg-primary)" rx="8" />

          {/* Grid lines for the ocean */}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`vg-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" className="ocean-grid" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`hg-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} className="ocean-grid" />
          ))}

          {/* Country paths */}
          {countries.map((country) => (
            <path
              key={country.id}
              d={country.path}
              className={`country-path ${nukedCountries.includes(country.id) ? 'country-path--nuked' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(country, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(country)}
            />
          ))}

          {/* Nuked markers */}
          {countries
            .filter((c) => nukedCountries.includes(c.id))
            .map((c) => (
              <text key={`nuke-${c.id}`} x={c.center.x} y={c.center.y} className="nuked-marker">
                ☢
              </text>
            ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="map-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            ⊕ {tooltip.name}
          </div>
        )}
      </div>
    </div>
  );
}
