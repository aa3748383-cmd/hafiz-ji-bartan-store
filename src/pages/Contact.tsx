import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Store,
  Clock,
  Send
} from 'lucide-react';
import { BUSINESS_DETAILS } from '../lib/constants';
import { getWhatsAppLink, getPhoneCallLink, getDirectionsLink } from '../utils/whatsapp';
import { updateSEOMetadata } from '../utils/seo';
import { useToast } from '../contexts/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Steel Bartan');
  const [message, setMessage] = useState('');

  useEffect(() => {
    updateSEOMetadata({
      title: 'Contact Store',
      description: `Contact Hafiz Ji Bartan Store owned by Akhlaq Ahmad at Main Road, Lalganj, Azamgarh UP. Call 9838559670 or send WhatsApp enquiry.`,
    });
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Hello Hafiz Ji Bartan Store, I am ${customerName || 'a customer'}`;
    if (customerPhone) text += ` (Phone: ${customerPhone})`;
    text += `. I want to inquire about ${inquiryType}.`;
    if (message.trim()) text += ` Note: ${message.trim()}`;

    const url = `https://wa.me/${BUSINESS_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast('Redirecting to WhatsApp', 'Sending your inquiry to store owner Akhlaq Ahmad.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-safe-action-bar">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
          Contact Hafiz Ji Bartan Store
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          We welcome you to visit our store on Main Road in Lalganj market or reach out directly to shop owner Akhlaq Ahmad via phone or WhatsApp.
        </p>
      </div>

      {/* MAIN CONTACT CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: STORE ADDRESS */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">Store Address</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {BUSINESS_DETAILS.fullAddress}
            </p>
            <div className="pt-2 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-stone-600">
                <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                <span><strong>Mon - Fri:</strong> 9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 pl-5 text-rose-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>Saturday: Closed</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <a
              href={getDirectionsLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        {/* CARD 2: DIRECT PHONE CALL */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">Phone Call</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Speak directly with shop proprietor <strong>{BUSINESS_DETAILS.owner}</strong> for price quotes & stock info.
            </p>
            <p className="text-lg font-bold text-stone-900">{BUSINESS_DETAILS.formattedPhone}</p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <a
              href={getPhoneCallLink()}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Store Now</span>
            </a>
          </div>
        </div>

        {/* CARD 3: WHATSAPP MESSAGING */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">WhatsApp Chat</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Send instant queries about item prices, availability, sizes, or custom steel bartan sets.
            </p>
            <p className="text-xs text-stone-500 font-bold">Fast responses during daily business hours</p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* QUICK ONLINE INQUIRY FORM */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-2xs">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Quick Inquiry</span>
            <h2 className="text-2xl font-bold font-serif text-stone-900">Send an Enquiry to Shop Owner</h2>
            <p className="text-xs text-stone-500">Fill in your details below to send an instant enquiry message directly via WhatsApp.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Category</label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-bold"
              >
                <option value="Steel Bartan">Steel Bartan / Utensils</option>
                <option value="Aluminium Cookware">Aluminium Cookware</option>
                <option value="Pressure Cookers">Pressure Cookers</option>
                <option value="Wedding Bartan Gift Set">Wedding Bartan Gift Set</option>
                <option value="General Store Price Inquiry">General Store Price Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify requirements, e.g. price for 5L pressure cooker or 51-piece steel dinner set..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>

      {/* MAP & STORE DETAILS BANNER */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 lg:p-12 border border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Store Location Details</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Hafiz Ji Bartan Store • Lalganj
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Main Road, Lalganj, Azamgarh, Uttar Pradesh, India
          </p>
          <div className="pt-2 text-xs text-stone-400 space-y-1">
            <p><strong>Store Owner:</strong> {BUSINESS_DETAILS.owner}</p>
            <p><strong>Direct Contact:</strong> {BUSINESS_DETAILS.formattedPhone}</p>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <a
            href={getDirectionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Navigation className="w-4 h-4 text-amber-300" />
            <span>Get Google Maps Directions</span>
          </a>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>

    </div>
  );
};

