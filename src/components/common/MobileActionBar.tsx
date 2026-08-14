import React from 'react';
import { Phone, MessageCircle, Navigation } from 'lucide-react';
import { getPhoneCallLink, getWhatsAppLink, getDirectionsLink } from '../../utils/whatsapp';

export const MobileActionBar: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-3 py-2.5">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* CALL CTA */}
        <a
          href={getPhoneCallLink()}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors active:scale-95 shadow-xs"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[11px] font-extrabold tracking-wider uppercase">CALL</span>
        </a>

        {/* WHATSAPP CTA */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors active:scale-95 shadow-xs"
        >
          <MessageCircle className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-extrabold tracking-wider uppercase">WHATSAPP</span>
        </a>

        {/* DIRECTIONS CTA */}
        <a
          href={getDirectionsLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-800 text-white hover:bg-amber-900 transition-colors active:scale-95 shadow-xs"
        >
          <Navigation className="w-4 h-4 text-amber-300 mb-0.5" />
          <span className="text-[11px] font-extrabold tracking-wider uppercase">DIRECTIONS</span>
        </a>
      </div>
    </div>
  );
};

