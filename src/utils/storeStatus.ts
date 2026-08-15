export interface StoreStatusInfo {
  isOpen: boolean;
  statusText: string;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
  detailedMessage: string;
}

export const getStoreStatusInfo = (date = new Date()): StoreStatusInfo => {
  const day = date.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const openMinutes = 9 * 60; // 9:00 AM
  const closeMinutes = 21 * 60; // 9:00 PM

  if (day === 6) {
    return {
      isOpen: false,
      statusText: 'Closed Today (Saturday)',
      badgeBg: 'bg-rose-50 border-rose-200/80',
      badgeText: 'text-rose-700 font-semibold',
      badgeDot: 'bg-rose-500',
      detailedMessage: 'Store is closed every Saturday. Reopens Monday at 9:00 AM.'
    };
  }

  if (day === 0) {
    return {
      isOpen: false,
      statusText: 'Closed Today (Sunday)',
      badgeBg: 'bg-rose-50 border-rose-200/80',
      badgeText: 'text-rose-700 font-semibold',
      badgeDot: 'bg-rose-500',
      detailedMessage: 'Store is closed on Sunday. Reopens Monday at 9:00 AM.'
    };
  }

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: 'Open Now',
      badgeBg: 'bg-emerald-50 border-emerald-200/80',
      badgeText: 'text-emerald-700 font-semibold',
      badgeDot: 'bg-emerald-500 animate-pulse',
      detailedMessage: 'Store is open today until 9:00 PM.'
    };
  }

  return {
    isOpen: false,
    statusText: 'Closed Now',
    badgeBg: 'bg-amber-50 border-amber-200/80',
    badgeText: 'text-amber-800 font-semibold',
    badgeDot: 'bg-amber-500',
    detailedMessage: 'Store opens at 9:00 AM on business days.'
  };
};
