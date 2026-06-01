/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InventoryView from './components/InventoryView';
import ServiceBookingView from './components/ServiceBookingView';
import LocationAndContact from './components/LocationAndContact';
import { ServiceBooking } from './types';
import { DEFAULT_SHOWROOM_CONFIG } from './data/inventory';

const DEFAULT_BOOKINGS: ServiceBooking[] = [];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const config = DEFAULT_SHOWROOM_CONFIG;

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    const cached = localStorage.getItem('tvs_showroom_bookings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return DEFAULT_BOOKINGS;
      }
    }
    return DEFAULT_BOOKINGS;
  });

  const handleAddBooking = (newBook: Omit<ServiceBooking, 'id' | 'createdAt' | 'status'>) => {
    const item: ServiceBooking = {
      ...newBook,
      id: `book-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...bookings];
    setBookings(updated);
    localStorage.setItem('tvs_showroom_bookings', JSON.stringify(updated));
  };

  const handleClearBookingsHistory = () => {
    if (window.confirm('Clear service booking history on this browser?')) {
      setBookings([]);
      localStorage.removeItem('tvs_showroom_bookings');
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white flex flex-col selection:bg-brand-red selection:text-white font-sans antialiased">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} config={config} />

      <main id="app-viewport" className="flex-1">
        {currentView === 'home' && <Hero setCurrentView={setCurrentView} config={config} />}
        {currentView === 'inventory' && <InventoryView config={config} />}
        {currentView === 'service' && (
          <ServiceBookingView
            config={config}
            onAddBooking={handleAddBooking}
            bookingsHistory={bookings}
            onClearHistory={handleClearBookingsHistory}
          />
        )}
        {currentView === 'location' && <LocationAndContact config={config} />}
      </main>

      <footer className="bg-[#070707] border-t border-white/10 text-white" id="site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-red text-white font-extrabold text-xl tracking-tighter mr-3">
                  TVS
                </span>
                <div>
                  <h2 className="text-base font-bold">{config.showroomName}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Authorized Dealer, Dharan</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sales, service, genuine parts, finance guidance, exchange support, and TVS ownership care for Sunsari riders.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Showroom</h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li>{config.address}</li>
                <li>Landline: {config.landlineNumber}</li>
                <li>WhatsApp: +{config.whatsappNumber}</li>
                <li className="break-all">{config.emailAddress}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Inventory', 'inventory'],
                  ['Service', 'service'],
                  ['Contact', 'location'],
                  ['Home', 'home'],
                ].map(([label, view]) => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className="text-left text-zinc-400 hover:text-white transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Hours</h3>
              <p className="text-xs text-zinc-400">{config.operatingHours.weekdays}</p>
              <p className="text-xs text-zinc-400 mt-1">{config.operatingHours.saturday}</p>
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600/15 border border-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600/25 transition"
              >
                WhatsApp Showroom
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-zinc-500">
            <p>&copy; {new Date().getFullYear()} {config.showroomName}. All rights reserved.</p>
            <p>TVS brand marks belong to TVS Motor Company. Product availability and trims may vary by Nepal distributor stock.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
