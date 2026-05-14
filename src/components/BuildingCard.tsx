'use client';

import { Building2, MapPin, ChevronRight } from 'lucide-react';

interface BuildingCardProps {
  name: string;
  location: string;
  roomCount: number;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function BuildingCard({ name, location, roomCount, imageUrl, isSelected, onClick }: BuildingCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full aspect-square rounded-[1.5rem] overflow-hidden group transition-all duration-500 ${
        isSelected ? 'ring-2 ring-accent-blue ring-offset-2 ring-offset-bg-secondary' : ''
      }`}
    >
      {/* Background Image with Gradient Overlay */}
      <img 
        src={imageUrl} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${
        isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-85'
      }`}></div>

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-left">
        <h3 className="text-sm font-black text-white tracking-tight leading-tight mb-1">{name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/60 text-[8px] font-bold uppercase tracking-widest">
            <MapPin size={8} />
            {location}
          </div>
          <div className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
            {roomCount} R
          </div>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-accent-blue p-1.5 rounded-full text-white shadow-lg animate-in zoom-in duration-300">
          <ChevronRight size={12} />
        </div>
      )}
    </button>
  );
}
