/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gauge, Fuel, X, Check, Award, ArrowUpDown } from 'lucide-react';
import { Bike, ShowroomConfig } from '../types';
import { TVS_INVENTORY } from '../data/inventory';
import { sendWeb3Form } from '../lib/web3forms';

interface InventoryViewProps {
  config: ShowroomConfig;
}

export default function InventoryView({ config }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'cc_desc'>('price_desc');
  
  // Modal states
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  
  // Form values
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState<'purchase' | 'test_ride' | 'exchange'>('purchase');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const categories: string[] = ['All', 'Premium Sport', 'Sports Commuter', 'Scooter', 'Electric', 'Moped', 'Three Wheeler'];

  // Filter & Sort Logic
  const filteredBikes = useMemo(() => {
    return TVS_INVENTORY.filter((bike) => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            bike.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || bike.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceNPR - b.priceNPR;
      if (sortBy === 'price_desc') return b.priceNPR - a.priceNPR;
      if (sortBy === 'cc_desc') return b.engineCC - a.engineCC;
      return 0;
    });
  }, [searchTerm, selectedCategory, sortBy]);

  // Format price helper
  const formatPrice = (price: number) => {
    if (!price) return 'Contact for price';
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleOpenEnquiry = (bike: Bike) => {
    setSelectedBike(bike);
    setShowEnquiryForm(true);
    setEnquiryMessage(`Hi New Krishna Traders TVS, I am interested in inquiring about the ${bike.name}. Please let me know about current colors available, financing options, and test-ride possibilities in Dharan!`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike) return;

    if (!customerName || !customerPhone) {
      alert('Please fill out your Name and Contact Phone number.');
      return;
    }

    setFormError('');
    setFormSubmitted(true);

    // Build Formatted Outgoing Messages
    const lineBreak = '\n';
    const enquiryTypeLabel = enquiryType === 'purchase' ? 'Direct Purchase' : enquiryType === 'test_ride' ? 'Test Ride Appointment' : 'Valuation for Spot Exchange';
    
    const plainMsg = `*TVS SHOWROOM ONLINE ENQUIRY*${lineBreak}` +
                     `--------------------------${lineBreak}` +
                     `*Bike:* ${selectedBike.name}${lineBreak}` +
                     `*Type:* ${enquiryTypeLabel}${lineBreak}` +
                     `*Customer:* ${customerName}${lineBreak}` +
                     `*Phone:* ${customerPhone}${lineBreak}` +
                     `*Email:* ${customerEmail || 'Not Provided'}${lineBreak}` +
                     `*Query:* ${enquiryMessage}`;

    try {
      await sendWeb3Form({
        subject: `New TVS inventory enquiry: ${selectedBike.name}`,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || 'Not provided',
        enquiry_type: enquiryTypeLabel,
        vehicle: selectedBike.name,
        message: enquiryMessage,
        replyto: customerEmail || config.emailAddress,
      });

      const whatsappURL = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(plainMsg)}`;
      window.open(whatsappURL, '_blank');

      setShowEnquiryForm(false);
      setSelectedBike(null);
      setFormSubmitted(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setEnquiryMessage('');
    } catch (error) {
      setFormSubmitted(false);
      setFormError(error instanceof Error ? error.message : 'Could not send message. Please try WhatsApp.');
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center md:text-left mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Live TVS Nepal Catalog</h2>
          <p className="text-zinc-400 max-w-xl">
            Browse the current TVS Nepal catalog and recent Nepal launches at <strong>{config.showroomName}</strong>. Prices and color availability are confirmed directly by the showroom before booking.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-white/5 mb-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search input (5 cols) */}
            <div className="relative lg:col-span-5" id="search-filter-wrapper">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-550" />
              <input
                id="inventory-search"
                type="text"
                placeholder="Search TVS models (Apache, Ronin, Raider, Ntorq, iQube, King)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-panel border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
              />
            </div>

            {/* Sort Dropdown (3 cols) */}
            <div className="relative lg:col-span-3" id="sort-selector-wrapper">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
                <select
                  id="inventory-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-brand-panel border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="cc_desc">Engine Size (CC)</option>
                </select>
              </div>
            </div>

            {/* Categories filters (4 cols) */}
            <div className="lg:col-span-12 xl:col-span-12 flex flex-wrap gap-2 pt-2 border-t border-white/5" id="category-scroller">
              {categories.map((category) => (
                <button
                  key={category}
                  id={`filter-category-${category.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-brand-red text-white shadow-md'
                      : 'bg-brand-panel text-zinc-400 border border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="inventory-grid">
          {filteredBikes.map((bike) => (
            <motion.div
              layout
              key={bike.id}
              id={`bike-card-${bike.id}`}
              className="bg-brand-surface rounded-xl border border-white/5 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-white/15 flex flex-col"
            >
              <div className="relative h-48 bg-brand-panel overflow-hidden">
                <img
                  src={bike.image}
                  alt={bike.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-brand-dark/80 backdrop-blur-md border border-white/5 text-zinc-300 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                  {bike.category}
                </span>
                
                {/* Custom Mileage Sticker */}
                <div className="absolute bottom-3 right-3 bg-brand-red/90 text-white text-[10.5px] font-mono font-black px-2 py-1 rounded shadow-sm">
                  {bike.engineCC > 0 ? `${bike.mileage} Kmpl` : `${bike.mileage} km range`}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{bike.name}</h3>
                  <div className="text-xl font-extrabold text-brand-red font-mono mt-1 mb-2">
                    {formatPrice(bike.priceNPR)}
                  </div>
                  
                  <p className="text-xs text-zinc-400 line-clamp-2 h-8 leading-relaxed mb-4">
                    {bike.description}
                  </p>

                  {/* Core Technical Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 font-mono mb-4 border-t border-white/5 pt-3">
                    <div className="flex items-center">
                      <Gauge className="w-3.5 h-3.5 mr-1.5 text-brand-red" />
                      <span>{bike.engineCC > 0 ? `${bike.engineCC} CC` : 'Electric'}</span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-3.5 h-3.5 mr-1.5 text-brand-red" />
                      <span>{bike.fuelCapacity > 0 ? `${bike.fuelCapacity} Liters` : 'EV battery'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setSelectedBike(bike)}
                    id={`view-specs-${bike.id}`}
                    className="flex-grow justify-center inline-flex items-center bg-white/5 hover:bg-white/10 text-zinc-350 hover:text-white px-3 py-2 rounded-lg text-xs font-semibold border border-white/5 transition cursor-pointer"
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => handleOpenEnquiry(bike)}
                    id={`enquire-${bike.id}`}
                    className="flex-grow justify-center inline-flex items-center bg-brand-red hover:bg-brand-red/90 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-md shadow-brand-red/10 active:scale-95 cursor-pointer"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredBikes.length === 0 && (
            <div className="col-span-full text-center py-12" id="no-inventory-match">
              <p className="text-zinc-500 font-mono text-sm">No TVS models match your filter preferences. Try resetting search fields.</p>
            </div>
          )}
        </div>

        {/* Slider Specification Overlays (Modals) */}
        <AnimatePresence>
          {selectedBike && !showEnquiryForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
              id="specifications-modal"
              onClick={() => setSelectedBike(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-brand-surface border border-white/5 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header image */}
                <div className="relative h-56 bg-brand-panel">
                  <img
                    src={selectedBike.image}
                    alt={selectedBike.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface text-white flex items-end p-6">
                    <div>
                      <span className="bg-brand-red text-white text-[10px] font-mono tracking-widest px-2 py-0.5 rounded uppercase font-bold">
                        {selectedBike.category}
                      </span>
                      <h3 className="text-2xl font-extrabold tracking-tight mt-1">{selectedBike.name}</h3>
                      <p className="text-sm font-semibold text-brand-red font-mono">{formatPrice(selectedBike.priceNPR)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBike(null)}
                    id="close-spec-modal"
                    className="absolute top-4 right-4 bg-brand-dark/75 text-zinc-400 hover:text-white p-2 rounded-full border border-white/10 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Specs parameters */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  
                  {/* Detailed specs table */}
                  <div>
                    <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-semibold mb-3">Technical Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Engine Displacement</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.engineCC > 0 ? `${selectedBike.engineCC} cc` : 'BLDC Electric Motor'}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Max Power</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.maxPower}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Max Torque</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.maxTorque}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Mileage (Est.)</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.mileage > 0 ? `${selectedBike.mileage} Kmpl` : '100 Km Range'}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Fuel Gas Capacity</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.fuelCapacity > 0 ? `${selectedBike.fuelCapacity} Liters` : 'Electric battery pack'}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Gearbox Transmission</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.transmission}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Curb Weight</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.weightKg > 0 ? `${selectedBike.weightKg} kg` : 'Confirm at showroom'}</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col">
                        <span className="text-zinc-500">Braking Setup</span>
                        <span className="font-bold text-white mt-0.5">{selectedBike.brakes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div>
                    <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-semibold mb-2.5">Key Performance Highlights</h4>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {selectedBike.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Description text */}
                  <div>
                    <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-semibold mb-1.5">Overview</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{selectedBike.description}</p>
                    {selectedBike.availabilityNote && (
                      <p className="text-[11px] text-brand-red mt-2 font-mono">{selectedBike.availabilityNote}</p>
                    )}
                  </div>

                </div>

                {/* Specs action bar */}
                <div className="bg-brand-panel p-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center text-xs text-zinc-400 font-mono">
                    <Award className="w-4 h-4 text-brand-red mr-1.5" />
                    <span>Test rides, colors, and trims are confirmed by showroom stock.</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedBike(null)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleOpenEnquiry(selectedBike)}
                      id="spec-modal-enquire-btn"
                      className="px-4 py-2 text-xs font-bold text-white bg-brand-red hover:bg-brand-red/90 rounded-lg shadow-md transition cursor-pointer"
                    >
                      Enquire Bike
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enquiry Slide-over Sheet / Form Modal */}
        <AnimatePresence>
          {showEnquiryForm && selectedBike && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
              id="enquiry-form-modal"
              onClick={() => {
                if (!formSubmitted) {
                  setShowEnquiryForm(false);
                  setSelectedBike(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="bg-brand-surface border border-white/5 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-brand-red to-brand-red/95 p-5 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">New Showroom Enquiry</h3>
                    <p className="text-xs text-white/80 font-mono">Bike: {selectedBike.name}</p>
                  </div>
                  {!formSubmitted && (
                    <button
                      onClick={() => {
                        setShowEnquiryForm(false);
                        setSelectedBike(null);
                      }}
                      id="close-enquiry"
                      className="text-white hover:text-white/80 bg-black/20 p-2 rounded-full hover:bg-black/35 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {!formSubmitted ? (
                  <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4" id="enquiry-form-fields">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="enq-name">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        id="enq-name"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Dinesh Bhandari"
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="enq-phone">
                          Phone Contact *
                        </label>
                        <input
                          type="tel"
                          id="enq-phone"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 98520xxxxx"
                          className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="enq-email">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          id="enq-email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Purpose of Inquiry *
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {[
                          { id: 'purchase', label: 'Purchase' },
                          { id: 'test_ride', label: 'Test Ride' },
                          { id: 'exchange', label: 'Exchange' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setEnquiryType(opt.id as any)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                              enquiryType === opt.id
                                ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10'
                                : 'bg-brand-panel text-zinc-400 border-white/5 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="enq-msg">
                        Inquiry Message *
                      </label>
                      <textarea
                        id="enq-msg"
                        rows={3}
                        required
                        value={enquiryMessage}
                        onChange={(e) => setEnquiryMessage(e.target.value)}
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>

                    <div className="bg-brand-panel p-3 rounded-lg border border-white/5 text-[11px] text-zinc-400">
                      <span className="font-bold text-brand-red uppercase block mb-1">How it works:</span>
                      Submitting sends your message to the showroom mailbox through Web3Forms, then opens WhatsApp so you can continue the conversation instantly.
                    </div>

                    {formError && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[11px] text-red-200">
                        {formError}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEnquiryForm(false);
                          setSelectedBike(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        id="enquiry-submit-btn"
                        className="px-6 py-2 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-bold rounded-lg shadow-md shadow-brand-red/10 active:scale-95 transition cursor-pointer"
                      >
                        Submit Enquiry
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-10 text-center space-y-4" id="enquiry-success-anim">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Message sent to mailbox</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Thank you {customerName}. Opening WhatsApp now so the showroom can coordinate availability, colors, finance, and test rides quickly.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
