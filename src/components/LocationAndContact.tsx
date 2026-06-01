/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Navigation, Star } from 'lucide-react';
import { ShowroomConfig } from '../types';
import { sendWeb3Form } from '../lib/web3forms';

interface LocationAndContactProps {
  config: ShowroomConfig;
}

export default function LocationAndContact({ config }: LocationAndContactProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderSubject, setSenderSubject] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [formDone, setFormDone] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderSubject || !senderMessage) {
      alert('Please fill out all required fields.');
      return;
    }

    setFormError('');
    setFormDone(true);

    const lineBreak = '\n';
    const rawText = `*NEW CONTACT MESSAGE (${senderSubject})*${lineBreak}` +
                    `--------------------------${lineBreak}` +
                    `*Sender Name:* ${senderName}${lineBreak}` +
                    `*Email Reply:* ${senderEmail || 'Not Provided'}${lineBreak}` +
                    `*Message Body:* ${senderMessage}`;

    try {
      await sendWeb3Form({
        subject: `Showroom contact: ${senderSubject}`,
        name: senderName,
        email: senderEmail || 'Not provided',
        message: senderMessage,
        replyto: senderEmail || config.emailAddress,
      });

      const whatsappURL = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(rawText)}`;
      window.open(whatsappURL, '_blank');

      setSenderName('');
      setSenderEmail('');
      setSenderSubject('');
      setSenderMessage('');
      setFormDone(false);
    } catch (error) {
      setFormDone(false);
      setFormError(error instanceof Error ? error.message : 'Could not send message. Please try WhatsApp.');
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Locate & Connect</h2>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold mb-3">TVS Authorized Showroom Dharan</p>
          <p className="text-xs text-zinc-400">
            Have questions about catalog pricing, financing schemes, or exchange rates? Visit our authorized showroom on Koshi Highway or get in touch below.
          </p>
        </div>

        {/* Map and contact cards info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Map & Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Embedded Google Map using coordinates */}
            <div className="bg-brand-surface p-3 rounded-2xl border border-white/5 shadow-md h-96 overflow-hidden relative group" id="embedded-map-container">
              <iframe
                title="Google Map: New Krishna Traders TVS Showroom"
                src={`https://maps.google.com/maps?q=${config.coordinates.lat},${config.coordinates.lng}&z=17&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="rounded-xl border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-6 left-6 bg-brand-surface/95 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-xs pointer-events-none max-w-xs shadow-lg">
                <h4 className="font-bold text-white mb-1">New Krishna Traders</h4>
                <p className="text-[10px] text-zinc-400 line-clamp-2">Dharan-13 Sunsari, on Koshi Highway, Koshi Province, Nepal</p>
              </div>
            </div>

            {/* Travel Directions and landmarks */}
            <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6" id="directions-landmarks">
              <div>
                <div className="flex items-center space-x-2 mb-2 font-bold text-sm text-white">
                  <Navigation className="w-4 h-4 text-brand-red" />
                  <span>How to Reach Us</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We are situated on the main <strong>Koshi Highway</strong> in Dharan-13 sector, right opposite the local bus terminal. Easily visible with the grand red and blue TVS Motors signs.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2 font-bold text-sm text-white">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>Showroom Highlights</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Fully operational 3S Facility of TVS: Features multi-bay Sales department, fully equipped spare Parts center, and active computerised Service warehouse.
                </p>
              </div>
            </div>

          </div>

          {/* Right Block: Working hours & Contact Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Hour times and Quick Details */}
            <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-md space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono">Showroom Operations</h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Operating Hours</span>
                    <p className="text-[10px] text-zinc-400 mt-1">{config.operatingHours.weekdays}</p>
                    <p className="text-[10px] text-zinc-400">{config.operatingHours.saturday}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Showroom Enquiries</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Landline: <strong className="text-white">{config.landlineNumber}</strong></p>
                    <p className="text-[10px] text-zinc-400">Mobile / WhatsApp: <strong className="text-white">+{config.whatsappNumber}</strong></p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Official Correspondence</span>
                    <p className="text-[10px] text-zinc-200 mt-1 break-all">{config.emailAddress}</p>
                  </div>
                </div>
              </div>

              {/* Instant Messenger Panel */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow inline-flex items-center justify-center py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/10 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Chat WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => document.getElementById('contact-form-fields')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="flex-grow inline-flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-xs font-semibold border border-white/10 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Web Message
                </button>
              </div>
            </div>

            {/* Interactive Message Form */}
            <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-md flex-grow space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono">Send Web Message</h3>
              
              {!formDone ? (
                <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-form-fields">
                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-400 uppercase tracking-wider mb-1" htmlFor="ct-name">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="ct-name"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Dinesh Bhandari"
                      className="w-full bg-brand-panel border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-mono text-zinc-400 uppercase tracking-wider mb-1" htmlFor="ct-email">
                        Your Contact Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="ct-email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-brand-panel border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-400 uppercase tracking-wider mb-1" htmlFor="ct-subj">
                      Subject Matter *
                    </label>
                    <input
                      type="text"
                      id="ct-subj"
                      required
                      value={senderSubject}
                      onChange={(e) => setSenderSubject(e.target.value)}
                      placeholder="e.g. Spare parts inquiry, finance documentation required"
                      className="w-full bg-brand-panel border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-400 uppercase tracking-wider mb-1" htmlFor="ct-msg">
                      Message Content *
                    </label>
                    <textarea
                      id="ct-msg"
                      rows={3}
                      required
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="How can our TVS staff help you?"
                      className="w-full bg-brand-panel border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                    />
                  </div>

                  {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[11px] text-red-200">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="contact-submit"
                    className="w-full py-2 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition active:scale-95 shadow-md shadow-brand-red/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Send to Mailbox
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center" id="contact-success-state">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Sending to mailbox...</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    Your message is being delivered through Web3Forms. WhatsApp will open next for quick follow-up.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
