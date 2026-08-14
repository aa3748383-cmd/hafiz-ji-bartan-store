import React, { useEffect, useState } from 'react';
import { 
  Store, 
  UserCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Utensils, 
  CheckCircle,
  Clock,
  ChevronDown,
  Gift
} from 'lucide-react';
import { BUSINESS_DETAILS } from '../lib/constants';
import { getWhatsAppLink, getPhoneCallLink, getDirectionsLink } from '../utils/whatsapp';
import { updateSEOMetadata } from '../utils/seo';

export const About: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    updateSEOMetadata({
      title: 'About Store',
      description: `Learn about ${BUSINESS_DETAILS.name} owned by ${BUSINESS_DETAILS.owner} on Main Road, Lalganj, Azamgarh, Uttar Pradesh. Authentic kitchenware & utensils.`,
    });
  }, []);

  const faqs = [
    {
      q: 'Do you offer bulk rates for wedding & function gifts?',
      a: 'Yes! We specialize in customized 51-piece, 71-piece, and 101-piece stainless steel dinner and utensil gift packages for weddings and functions with special discount rates.'
    },
    {
      q: 'What types of metals & material grades do you sell?',
      a: 'We stock heavy-gauge Food Grade Stainless Steel (202 & 304 grade), heavy aluminium cooking patilis, copper bottom utensils, brass items, and trusted pressure cooker brands.'
    },
    {
      q: 'Can I check stock availability or prices before visiting the store?',
      a: 'Absolutely. You can call shop proprietor Akhlaq Ahmad directly at +91 98385 59670 or send a photo/inquiry on WhatsApp for instant confirmation.'
    },
    {
      q: 'What are your store business hours?',
      a: 'Hafiz Ji Bartan Store is open Monday through Saturday from 9:00 AM to 9:00 PM on Main Road, Lalganj, Azamgarh.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-safe-action-bar">
      
      {/* HERO / OVERVIEW */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
            About Our Local Business
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 leading-tight">
            {BUSINESS_DETAILS.name}
          </h1>
          <p className="text-stone-700 text-base leading-relaxed">
            Located on <strong className="text-stone-900 font-semibold">{BUSINESS_DETAILS.address}, {BUSINESS_DETAILS.city}, {BUSINESS_DETAILS.state}</strong>, {BUSINESS_DETAILS.name} is a trusted local retail store providing high-quality household kitchenware, stainless steel bartan, pressure cookers, and daily cooking items.
          </p>
          <p className="text-stone-700 text-base leading-relaxed">
            The store is owned and personally managed by <strong className="text-stone-900 font-semibold">{BUSINESS_DETAILS.owner}</strong>, ensuring every customer in Lalganj and surrounding Azamgarh villages receives attentive service, fair prices, and genuine products.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Owner on WhatsApp</span>
            </a>

            <a
              href={getPhoneCallLink()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-sm shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call ({BUSINESS_DETAILS.phone})</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
          <h3 className="text-lg font-bold font-serif text-stone-900 border-b border-stone-200 pb-3 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-800" />
            <span>Verified Store Profile</span>
          </h3>

          <ul className="space-y-3 text-sm text-stone-700">
            <li className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Proprietor:</strong> {BUSINESS_DETAILS.owner}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Phone:</strong> {BUSINESS_DETAILS.formattedPhone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Address:</strong> {BUSINESS_DETAILS.fullAddress}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Working Hours:</strong> Mon - Sat (9:00 AM - 9:00 PM)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Specialization:</strong> Steel Bartan / Cookware / Wedding Sets</span>
            </li>
          </ul>

          <div className="pt-2">
            <a
              href={getDirectionsLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View Google Maps Directions</span>
            </a>
          </div>
        </div>

      </div>

      {/* CORE STORE VALUES & OFFERINGS */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            What We Offer
          </h2>
          <p className="text-stone-600 text-sm">
            Complete range of daily cooking, serving, and storage items for every household kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
            <CheckCircle className="w-6 h-6 text-amber-800" />
            <h3 className="font-bold text-stone-900">Stainless Steel Bartan</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Plates, thalis, katoris, storage dabbas, jugs, and spoons made of high grade steel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
            <CheckCircle className="w-6 h-6 text-amber-800" />
            <h3 className="font-semibold text-stone-900">Aluminium Utensils</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Heavy gauge cooking patili, bhagona, kadais, and daily milk vessels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
            <CheckCircle className="w-6 h-6 text-amber-800" />
            <h3 className="font-bold text-stone-900">Pressure Cookers</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Outer and inner lid pressure cookers in multiple litre capacities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
            <Gift className="w-6 h-6 text-amber-800" />
            <h3 className="font-bold text-stone-900">Wedding Gift Sets</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Complete family dinner sets, spice boxes, chimta, belan-chakla, and gift packages.
            </p>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6 shadow-2xs">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Customer Support</span>
          <h2 className="text-2xl font-bold font-serif text-stone-900">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-stone-900 flex items-center justify-between gap-4 bg-stone-50/70 hover:bg-stone-100 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-amber-800' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 pt-2 text-xs text-stone-600 leading-relaxed bg-white border-t border-stone-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

