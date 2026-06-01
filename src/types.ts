/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BikeCategory = 'Premium Sport' | 'Sports Commuter' | 'Scooter' | 'Electric' | 'Moped' | 'Three Wheeler';

export interface Bike {
  id: string;
  name: string;
  category: BikeCategory;
  engineCC: number;
  maxPower: string; // e.g. "20.82 PS @ 9000 rpm"
  maxTorque: string; // e.g. "17.25 Nm @ 7250 rpm"
  fuelCapacity: number; // in Liters
  mileage: number; // in kmpl
  priceNPR: number; // Price in NPR (Nepalese Rupees)
  availabilityNote?: string;
  image: string; // Direct image path or high-quality placeholder URL
  description: string;
  highlights: string[];
  transmission: string;
  weightKg: number;
  brakes: string; // e.g. "Dual Channel ABS"
}

export interface ShowroomConfig {
  showroomName: string;
  address: string;
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  whatsappNumber: string; // e.g. "9779852047395" - actual number
  emailAddress: string;   // e.g. "newkrishnatvsdharan@gmail.com"
  landlineNumber: string; // e.g. "+977-25-525039"
  operatingHours: {
    weekdays: string; // Sunday - Friday
    saturday: string;
  };
}

export interface Enquiry {
  id: string;
  bikeId: string;
  bikeName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  enquiryType: 'purchase' | 'test_ride' | 'exchange';
  message: string;
  status: 'pending' | 'responded' | 'archived';
  createdAt: string;
}

export interface ServiceBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  registrationNumber: string;
  serviceType: 'free' | 'paid' | 'major_repair' | 'regular';
  preferredDate: string;
  preferredTimeSlot: string;
  additionalNotes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  createdAt: string;
}
