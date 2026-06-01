/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Wrench, Clock, ShieldCheck, Check, History, Trash2 } from 'lucide-react';
import { ServiceBooking, ShowroomConfig } from '../types';
import { TVS_INVENTORY } from '../data/inventory';
import { sendWeb3Form } from '../lib/web3forms';

interface ServiceBookingViewProps {
  config: ShowroomConfig;
  onAddBooking: (booking: Omit<ServiceBooking, 'id' | 'createdAt' | 'status'>) => void;
  bookingsHistory: ServiceBooking[];
  onClearHistory: () => void;
}

export default function ServiceBookingView({ config, onAddBooking, bookingsHistory, onClearHistory }: ServiceBookingViewProps) {
  // Booking Form Inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bikeModel, setBikeModel] = useState(TVS_INVENTORY[0].name);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [serviceType, setServiceType] = useState<'free' | 'paid' | 'major_repair' | 'regular'>('regular');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Interaction State
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [recentBooking, setRecentBooking] = useState<Omit<ServiceBooking, 'id' | 'createdAt' | 'status'> | null>(null);
  const [formError, setFormError] = useState('');

  // Default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    setPreferredDate(dateString);
  }, []);

  const timeSlots = [
    { time: '09:00 AM - 11:00 AM', availability: 'High' },
    { time: '11:00 AM - 01:00 PM', availability: 'Few Slots Left' },
    { time: '02:00 PM - 04:00 PM', availability: 'High' },
    { time: '04:00 PM - 06:00 PM', availability: 'Limited' },
  ];

  const servicePackages = [
    {
      id: 'regular',
      title: 'Regular Service',
      price: 'NPR 1,200',
      description: 'Includes engine oil replace, chain adjust, air filter cleaning, battery test, spark plugs diagnostics and 24-point check.',
    },
    {
      id: 'free',
      title: 'Free Coupon Service',
      price: 'Free Coupon',
      description: 'Standard coupon-based periodic service for newly purchased bikes (covers scheduled tuning & inspections as per manual).',
    },
    {
      id: 'paid',
      title: 'Major Tuning & Polish',
      price: 'NPR 2,800',
      description: 'Full water wash, carbonator/injector deep cleanup, dynamic system greasing, performance tuning and wheel balance check.',
    },
    {
      id: 'major_repair',
      title: 'Engine / Suspension Diagnostics',
      price: 'Custom Estimate',
      description: 'High precision engine breakdown tuning, transmission, custom mono-shock adjusting & electrical diagnosis by certified TVS masters.',
    }
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !preferredDate) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const bookingData = {
      customerName,
      customerPhone,
      bikeModel,
      registrationNumber: registrationNumber || 'In Process',
      serviceType,
      preferredDate,
      preferredTimeSlot,
      additionalNotes: additionalNotes || 'None',
    };

    setFormError('');
    onAddBooking(bookingData);
    setRecentBooking(bookingData);
    setBookingSuccess(true);

    // Dynamic messaging formats
    const serviceLabel = servicePackages.find(p => p.id === serviceType)?.title || 'Service Appointment';
    const lineBreak = '\n';
    
    const formattedMsg = `*TVS SERVICE BOOKING CONFIRMATION*${lineBreak}` +
                         `--------------------------${lineBreak}` +
                         `*Customer:* ${customerName}${lineBreak}` +
                         `*Phone:* ${customerPhone}${lineBreak}` +
                         `*Vehicle Model:* ${bikeModel}${lineBreak}` +
                         `*Reg Number:* ${registrationNumber || 'In Process'}${lineBreak}` +
                         `*Service Package:* ${serviceLabel}${lineBreak}` +
                         `*Date Schedule:* ${preferredDate}${lineBreak}` +
                         `*Arrival Slot:* ${preferredTimeSlot}${lineBreak}` +
                         `*Client Notes:* ${additionalNotes || 'No notes'}`;

    try {
      await sendWeb3Form({
        subject: `Service booking request: ${customerName} (${bikeModel})`,
        name: customerName,
        phone: customerPhone,
        vehicle: bikeModel,
        registration_number: registrationNumber || 'In Process',
        service_package: serviceLabel,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        message: additionalNotes || 'No notes',
        replyto: config.emailAddress,
      });

      const whatsappURL = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(formattedMsg)}`;
      window.open(whatsappURL, '_blank');

      setCustomerName('');
      setCustomerPhone('');
      setRegistrationNumber('');
      setAdditionalNotes('');
    } catch (error) {
      setBookingSuccess(false);
      setFormError(error instanceof Error ? error.message : 'Could not send booking. Please try WhatsApp.');
    }
  };

  const ServiceTypeLabel = (id: string) => {
    if (id === 'free') return 'Free';
    if (id === 'paid') return 'Polishing';
    if (id === 'major_repair') return 'Engine Tech';
    return 'Regular';
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Booking Wizard (7 cols) */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <div className="bg-brand-surface p-6 sm:p-8 rounded-2xl border border-white/5 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Smart Service Scheduler</h2>
                <p className="text-xs text-brand-red font-mono font-semibold">AUTHORIZED TVS 3-STAR WORKSHOP &bull; SUNSARI</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-6 font-sans">
              Enter your bike details below to reserve a service bay. Your request is sent to the showroom mailbox through Web3Forms, with WhatsApp kept available for instant follow-up.
            </p>

            <AnimatePresence mode="wait">
              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4" id="booking-form-fields">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-name">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        id="book-name"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Dinesh Bhandari"
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-phone">
                        WhatsApp/Phone Contact *
                      </label>
                      <input
                        type="tel"
                        id="book-phone"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Mobile (e.g. 98520xxxxx)"
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-bike">
                        TVS Bike/Scooter Model *
                      </label>
                      <select
                        id="book-bike"
                        value={bikeModel}
                        onChange={(e) => setBikeModel(e.target.value)}
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      >
                        {TVS_INVENTORY.map((bike) => (
                          <option key={bike.id} value={bike.name} className="bg-brand-surface text-white">
                            {bike.name}
                          </option>
                        ))}
                        <option value="Other TVS Vehicle" className="bg-brand-surface text-white">Other TVS Bike / Scooter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-reg">
                        Registration / Lot Number
                      </label>
                      <input
                        type="text"
                        id="book-reg"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. KO 2 PA 4321 / In Process"
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                  </div>

                  {/* Service Package Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Select Service Package *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="service-options-grid">
                      {servicePackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setServiceType(pkg.id as any)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                            serviceType === pkg.id
                              ? 'bg-brand-red/10 border-brand-red/80 text-white'
                              : 'bg-brand-panel border border-white/5 hover:border-white/10 text-zinc-350'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-white">{pkg.title}</span>
                              <span className="text-[10.5px] font-mono text-brand-red font-bold">{pkg.price}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{pkg.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timing details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-date">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="book-date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Preferred Arrival Time Slot *
                      </label>
                      <select
                        id="book-slot"
                        value={preferredTimeSlot}
                        onChange={(e) => setPreferredTimeSlot(e.target.value)}
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot.time} value={slot.time} className="bg-brand-surface text-white">
                            {slot.time} ({slot.availability})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1" htmlFor="book-notes">
                      Bike Issues / Additional Notes
                    </label>
                    <textarea
                      id="book-notes"
                      rows={2.5}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Mileage check-up, frontend noise, gear shifts feels hard, periodic wash..."
                      className="w-full bg-brand-panel border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                    />
                  </div>

                  {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[11px] text-red-200">
                      {formError}
                    </div>
                  )}

                  <div className="pt-2 text-right">
                    <button
                      type="submit"
                      id="submit-booking"
                      className="w-full sm:w-auto px-6 py-2.5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-brand-red/20 cursor-pointer"
                    >
                      Send Booking Request
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 text-center space-y-4" id="booking-success-message">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Booking sent to mailbox</h3>
                    <p className="text-xs text-zinc-400 font-mono">Bike Model: <strong className="text-zinc-200">{recentBooking?.bikeModel}</strong></p>
                    <p className="text-xs text-zinc-400 font-mono">Expected Arrival: <strong className="text-zinc-200">{recentBooking?.preferredDate} ({recentBooking?.preferredTimeSlot})</strong></p>
                  </div>

                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Your service request was delivered through Web3Forms. WhatsApp is opening so the TVS Dharan technical desk can confirm your slot quickly.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-350 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Book Another Service
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Workshop Details & History (5 cols) */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          {/* Support Guarantee Info */}
          <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-md">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono mb-3">TVS Quality Guarantee</h3>
            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">TVS Trained Technicians</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Every technician has completed corporate diagnostics and performance optimization programs.</p>
                </div>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Computerised System Scanners</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Advanced state diagnostic scanners utilized for precision fuel mappings on RT-Fi engines.</p>
                </div>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Immediate Digital Estimates</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Get accurate cost and timelines sent direct to your phone before major mechanical repairs start.</p>
                </div>
              </li>
            </ul>
          </div>
 
          {/* Core Booking History list */}
          <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-md flex-grow">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-zinc-450" />
                <h3 className="text-sm font-bold text-white">Your Bookings History</h3>
              </div>
              
              {bookingsHistory.length > 0 && (
                <button
                  onClick={onClearHistory}
                  id="clear-booking-history"
                  className="text-[10px] text-brand-red hover:text-brand-red/85 font-mono uppercase flex items-center cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear Logs
                </button>
              )}
            </div>
 
            {bookingsHistory.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1" id="booking-history-list">
                {bookingsHistory.map((item, index) => (
                  <div
                    key={item.id || index}
                    id={`history-booking-${index}`}
                    className="p-3 bg-brand-panel rounded-xl border border-white/5 text-xs relative flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white block truncate max-w-[150px]">{item.bikeModel}</span>
                      <span className="text-[9px] font-mono bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded uppercase font-semibold">
                        {ServiceTypeLabel(item.serviceType)}
                      </span>
                    </div>
 
                    <div className="space-y-0.5 text-zinc-400 text-[10.5px] font-mono">
                       <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-zinc-500" />
                        <span>Date: {item.preferredDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-zinc-500" />
                        <span>Slot: {item.preferredTimeSlot}</span>
                      </div>
                      {item.registrationNumber && (
                        <div className="text-[10px] text-zinc-500">
                          Lot: {item.registrationNumber}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-zinc-550 font-mono" id="no-booking-history">
                <p>No active service bookings found on this browser.</p>
              </div>
            )}
          </div>
 
        </div>

      </div>
    </div>
  );
}
