/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Calendar, MapPin, Compass, Phone } from 'lucide-react';
import { ShowroomConfig } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  config: ShowroomConfig;
}

export default function Navbar({ currentView, setCurrentView, config }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'inventory', label: 'Inventory', icon: ShieldCheck },
    { id: 'service', label: 'Service Booking', icon: Calendar },
    { id: 'location', label: 'Find Us & Contact', icon: MapPin },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-3">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('home')} id="nav-logo">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-red text-white font-extrabold text-xl tracking-tighter mr-3 shadow-md shadow-brand-red/30">
              TVS
            </span>
            <div>
              <h1 className="text-sm sm:text-md font-bold tracking-tight text-white">{config.showroomName}</h1>
              <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Authorized Dealer &bull; Dharan</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex space-x-1 lg:space-x-2" id="nav-desktop-tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Contact Button */}
          <div className="flex items-center space-x-3">
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center text-xs text-emerald-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition"
              id="nav-quick-wa"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-emerald-400 animate-pulse" />
              <span>WhatsApp Live</span>
            </a>
            
            {/* Mobile Nav Button */}
            <div className="flex lg:hidden">
              <select
                id="nav-mobile-select"
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
                className="bg-brand-surface border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 font-medium focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:outline-none"
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
