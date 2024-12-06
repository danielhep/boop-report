'use client';

import { useState } from 'react';

interface PillSelectProps {
  options: string[];
  defaultSelected?: string;
  onChange?: (selected: string) => void;
}

export default function PillSelect({ options, defaultSelected, onChange }: PillSelectProps) {
  const [selected, setSelected] = useState(defaultSelected || options[0]);
  const [sliderStyle, setSliderStyle] = useState({ left: '4px', width: '0px' });

  const handleSelect = (option: string, element: HTMLDivElement | null) => {
    if (!element) return;
    
    const parent = element.parentElement;
    if (parent) {
      const left = element.offsetLeft + 4;
      const width = element.offsetWidth - 8;
      setSliderStyle({ left: `${left}px`, width: `${width}px` });
    }
    
    setSelected(option);
    onChange?.(option);
  };

  const handleKeyDown = (option: string, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(option, event.currentTarget);
    }
  };

  return (
    <div className="pill-select" role="radiogroup">
      <div 
        className="pill-select-slider"
        style={sliderStyle}
      />
      {options.map((option) => (
        <div
          key={option}
          role="radio"
          aria-checked={selected === option}
          tabIndex={0}
          className={`pill-select-option ${
            selected === option ? 'text-white' : 'text-text-main'
          }`}
          onClick={(e) => handleSelect(option, e.currentTarget)}
          onKeyDown={(e) => handleKeyDown(option, e)}
        >
          {option}
        </div>
      ))}
    </div>
  );
} 