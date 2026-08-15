import React, { useState } from 'react';
import { X, MessageCircle, Phone } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { BUSINESS_DETAILS } from '../../lib/constants';

interface EnquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const handleSendWhatsApp = () => {
    let text = `Hello, I want to enquire about ${product.name} (Price: ${formatCurrency(product.price)}) from Hafiz Ji Bartan Store.`;
    if (quantity > 1) {
      text += ` Quantity: ${quantity}.`;
    }
    if (note.trim()) {
      text += ` Note: ${note.trim()}`;
    }

    const url = `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-slide-up relative">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL TITLE */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-stone-900 leading-tight">Product Enquiry</h3>
            <p className="text-xs text-stone-500">Hafiz Ji Bartan Store • Lalganj, Azamgarh</p>
          </div>
        </div>

        {/* PRODUCT SUMMARY CARD */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-xl shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-stone-900 text-sm truncate">{product.name}</h4>
            <p className="text-stone-500 text-xs mt-0.5">{product.category?.name || 'Utensils'}</p>
            <p className="text-brand-700 font-bold text-sm mt-1">{formatCurrency(product.price)}</p>
          </div>
        </div>

        {/* QUANTITY & NOTES */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Estimated Quantity Needed:
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Optional Message / Inquiry Note:
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Do you deliver near Lalganj market? Is discount available for bulk purchase?"
              className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
            />
          </div>

          {new Date().getDay() === 6 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
              <span>Note: Store is closed today (Saturday). Enquiries will be addressed on Monday.</span>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSendWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send WhatsApp Enquiry</span>
          </button>
          
          <a
            href={`tel:${BUSINESS_DETAILS.phone}`}
            className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm flex items-center justify-center gap-2 border border-stone-200 transition-all"
          >
            <Phone className="w-4 h-4 text-brand-700" />
            <span>Direct Call</span>
          </a>
        </div>

      </div>
    </div>
  );
};
