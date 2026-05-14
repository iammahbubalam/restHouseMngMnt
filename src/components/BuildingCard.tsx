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
      className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden group active:scale-95 transition-all duration-300 border ${
        isSelected ? 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/5'
      }`}
    >
      <img 
        src={imageUrl} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 ${
        isSelected ? 'opacity-100' : 'opacity-80'
      }`}></div>

      <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-left">
        <div>
          <p className="text-[6px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">{location}</p>
          <h3 className="text-[9px] font-black text-white tracking-tight uppercase leading-none">{name}</h3>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[6px] font-black text-white/60 uppercase tracking-widest border border-white/5">
            {roomCount} Units
          </div>
          {isSelected && (
            <div className="h-4 w-4 bg-white rounded-full flex items-center justify-center text-black">
              <ChevronRight size={10} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
