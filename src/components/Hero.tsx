/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ShieldAlert, Award, TrendingUp, MessageCircle, MapPin } from 'lucide-react';
import { ShowroomConfig } from '../types';

interface HeroProps {
  setCurrentView: (view: string) => void;
  config: ShowroomConfig;
}

export default function Hero({ setCurrentView, config }: HeroProps) {
  return (
    <div className="relative bg-brand-dark overflow-hidden text-white">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(237,28,36,0.1),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
            id="hero-content"
          >
            <div className="inline-flex items-center space-x-2 bg-brand-red/10 border border-brand-red/30 px-3 py-1.5 rounded-full text-brand-red text-xs font-mono tracking-wider font-semibold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Nepals Trusted TVS Dealer &bull; Dharan 13</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Ride the Racing DNA with <span className="text-brand-red">TVS Motors</span>
            </h1>

            <p className="text-lg text-zinc-300 max-w-lg leading-relaxed">
              Experience the adrenaline-pumping RTR series, retro cruiser Ronin, sporty Ntorq scooters, and cutting-edge iQube electric at <strong>{config.showroomName}</strong>. Your authorized path to premium performance in Dharan, Sunsari.
            </p>

            <div className="flex flex-wrap gap-4 pt-2" id="hero-actions">
              <button
                onClick={() => setCurrentView('inventory')}
                id="hero-btn-inventory"
                className="px-6 py-3 bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-lg shadow-lg shadow-brand-red/20 transition-all active:scale-95 text-base flex items-center cursor-pointer"
              >
                Explore Inventory
              </button>
              <button
                onClick={() => setCurrentView('service')}
                id="hero-btn-service"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-all active:scale-95 text-base flex items-center cursor-pointer"
              >
                <Calendar className="w-5 h-5 mr-2 text-brand-red" />
                Book a Service
              </button>
            </div>

            {/* Quick Connect with Owner */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 font-mono">Immediate Inquiry Channels</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${config.whatsappNumber}?text=Hello%20New%20Krishna%20Traders%20TVS%2C%20Id%20like%20to%20inquire%20about%20your%20available%20bike%20inventory.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-xs text-white bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-400 fill-emerald-400" />
                  Request via WhatsApp
                </a>
                <button
                  onClick={() => setCurrentView('location')}
                  type="button"
                  className="flex items-center text-xs text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition"
                >
                  <MapPin className="w-4 h-4 mr-2 text-brand-red" />
                  Send Web Message
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bike Showcase Carousel/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            id="hero-showcase"
          >
            {/* Visual Backdrops */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-red to-transparent opacity-20 blur-xl group-hover:opacity-45 transition duration-1000" />
            
            <div className="relative rounded-2xl bg-brand-surface border border-white/5 overflow-hidden shadow-2xl p-4">
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800"
                  alt="TVS Apache RTR Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="bg-brand-red text-white text-xs font-mono tracking-widest px-2 py-0.5 rounded font-extrabold uppercase font-sans">Spotlight</span>
                    <h3 className="text-xl font-bold text-white mt-1">TVS Apache RR 310</h3>
                    <p className="text-xs text-zinc-300 font-mono">NPR 8,15,000 | Pure Racing Flagship</p>
                  </div>
                </div>
              </div>

              {/* Showroom Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="p-3 bg-brand-panel/40 rounded-lg border border-white/5">
                  <span className="block text-2xl font-black text-brand-red font-mono">100%</span>
                  <span className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider">TVS Genuine Parts</span>
                </div>
                <div className="p-3 bg-brand-panel/40 rounded-lg border border-white/5">
                  <span className="block text-2xl font-black text-white font-mono font-sans font-bold">17</span>
                  <span className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Live Models</span>
                </div>
                <div className="p-3 bg-brand-panel/40 rounded-lg border border-white/5">
                  <span className="block text-2xl font-black text-emerald-400 font-mono">&lt; 30m</span>
                  <span className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Instant Approval</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/5" id="hero-features">
          <div className="flex items-start space-x-4 p-5 bg-brand-surface border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl">
            <div className="p-3 rounded-lg bg-brand-red/10 text-brand-red">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Spot Exchange Offer</h3>
              <p className="text-xs text-zinc-400 mt-1">Bring in any old motorcycle of any brand and ride home with a brand-new TVS with spot valuation!</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-5 bg-brand-surface border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl">
            <div className="p-3 rounded-lg bg-brand-red/10 text-brand-red">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Booking</h3>
              <p className="text-xs text-zinc-400 mt-1">Book your TVS free or paid servicing online and skip standard showroom waiting lines entirely.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-5 bg-brand-surface border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl">
            <div className="p-3 rounded-lg bg-brand-red/10 text-brand-red">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">TVS Warranty Shield</h3>
              <p className="text-xs text-zinc-400 mt-1">Get 5 Years of peace-of-mind warranty cover on engine blocks and all standard electrical systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
