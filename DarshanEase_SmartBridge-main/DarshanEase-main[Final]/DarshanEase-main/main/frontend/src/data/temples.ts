import temple1 from "@/assets/temple-1.jpg";
import temple2 from "@/assets/temple-2.jpg";
import temple3 from "@/assets/temple-3.jpg";
import temple4 from "@/assets/temple-4.jpg";
import temple5 from "@/assets/temple-5.jpg";
import temple6 from "@/assets/temple-6.jpg";

export interface DarshanType {
  id: string;
  name: string;
  timing: string;
  normalPrice: number;
  vipPrice: number;
  crowdLevel: "Low" | "Medium" | "High";
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  image: string;
  timings: string;
  darshans: DarshanType[];
}

export const temples: Temple[] = [
  {
    id: "1",
    name: "Tirumala Venkateswara Temple",
    location: "Tirupati, Andhra Pradesh",
    description: "One of the most visited and richest temples in the world, dedicated to Lord Venkateswara.",
    rating: 4.9,
    image: temple1,
    timings: "3:00 AM - 10:00 PM",
    darshans: [
      { id: "d1", name: "Sarva Darshan", timing: "6:00 AM - 8:00 PM", normalPrice: 0, vipPrice: 300, crowdLevel: "High" },
      { id: "d2", name: "Special Entry", timing: "5:00 AM - 9:00 PM", normalPrice: 300, vipPrice: 500, crowdLevel: "Medium" },
      { id: "d3", name: "VIP Break Darshan", timing: "By Slot", normalPrice: 500, vipPrice: 1000, crowdLevel: "Low" },
    ],
  },
  {
    id: "2",
    name: "Somnath Temple",
    location: "Veraval, Gujarat",
    description: "The first among the twelve Jyotirlinga shrines of Lord Shiva, located on the western coast.",
    rating: 4.8,
    image: temple2,
    timings: "6:00 AM - 9:30 PM",
    darshans: [
      { id: "d4", name: "Morning Aarti", timing: "7:00 AM - 8:00 AM", normalPrice: 0, vipPrice: 200, crowdLevel: "Medium" },
      { id: "d5", name: "General Darshan", timing: "6:00 AM - 9:00 PM", normalPrice: 0, vipPrice: 300, crowdLevel: "High" },
    ],
  },
  {
    id: "3",
    name: "Ajanta Caves Temple",
    location: "Aurangabad, Maharashtra",
    description: "Ancient Buddhist cave monuments featuring stunning paintings and sculptures from 2nd century BCE.",
    rating: 4.7,
    image: temple3,
    timings: "9:00 AM - 5:30 PM",
    darshans: [
      { id: "d6", name: "Guided Tour", timing: "9:00 AM - 5:00 PM", normalPrice: 200, vipPrice: 500, crowdLevel: "Medium" },
      { id: "d7", name: "Self-Guided Visit", timing: "9:00 AM - 5:00 PM", normalPrice: 100, vipPrice: 300, crowdLevel: "Low" },
    ],
  },
  {
    id: "4",
    name: "Ramanathaswamy Temple",
    location: "Rameswaram, Tamil Nadu",
    description: "A sacred Hindu temple dedicated to Lord Shiva, one of the twelve Jyotirlinga temples.",
    rating: 4.8,
    image: temple4,
    timings: "5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
    darshans: [
      { id: "d8", name: "Sparsha Darshan", timing: "5:00 AM - 12:00 PM", normalPrice: 100, vipPrice: 500, crowdLevel: "High" },
      { id: "d9", name: "Abhishekam", timing: "6:00 AM - 11:00 AM", normalPrice: 300, vipPrice: 700, crowdLevel: "Low" },
    ],
  },
  {
    id: "5",
    name: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    description: "One of the most famous Hindu temples dedicated to Lord Shiva, located in the holy city of Varanasi.",
    rating: 4.9,
    image: temple5,
    timings: "3:00 AM - 11:00 PM",
    darshans: [
      { id: "d10", name: "Mangla Aarti", timing: "3:00 AM - 4:00 AM", normalPrice: 0, vipPrice: 500, crowdLevel: "Low" },
      { id: "d11", name: "General Darshan", timing: "4:00 AM - 11:00 PM", normalPrice: 0, vipPrice: 300, crowdLevel: "High" },
    ],
  },
  {
    id: "6",
    name: "Meenakshi Amman Temple",
    location: "Madurai, Tamil Nadu",
    description: "Historic Hindu temple dedicated to Meenakshi (Parvati) and Sundareshwar (Shiva).",
    rating: 4.7,
    image: temple6,
    timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
    darshans: [
      { id: "d12", name: "Morning Darshan", timing: "5:00 AM - 12:00 PM", normalPrice: 0, vipPrice: 200, crowdLevel: "Medium" },
      { id: "d13", name: "Special Pooja", timing: "6:00 AM - 10:00 AM", normalPrice: 250, vipPrice: 600, crowdLevel: "Low" },
    ],
  },
];

export interface Booking {
  id: string;
  templeId: string;
  templeName: string;
  darshanName: string;
  date: string;
  tickets: number;
  totalAmount: number;
  status: "confirmed" | "pending" | "completed";
}

export const sampleBookings: Booking[] = [
  { id: "B001", templeId: "1", templeName: "Tirumala Venkateswara", darshanName: "Special Entry", date: "2026-03-15", tickets: 2, totalAmount: 600, status: "confirmed" },
  { id: "B002", templeId: "5", templeName: "Kashi Vishwanath", darshanName: "Mangla Aarti", date: "2026-03-20", tickets: 4, totalAmount: 2000, status: "confirmed" },
  { id: "B003", templeId: "2", templeName: "Somnath Temple", darshanName: "Morning Aarti", date: "2026-02-10", tickets: 3, totalAmount: 600, status: "completed" },
  { id: "B004", templeId: "4", templeName: "Ramanathaswamy", darshanName: "Abhishekam", date: "2026-03-25", tickets: 1, totalAmount: 700, status: "pending" },
];
