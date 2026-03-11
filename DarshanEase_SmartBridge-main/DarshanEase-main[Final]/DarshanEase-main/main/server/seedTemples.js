const mongoose = require('mongoose');
const Temple = require('./models/Temple');
require('dotenv').config();

const seedTemples = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing temples
    await Temple.deleteMany({});
    console.log('Cleared existing temples');

    // Sample temples
    const temples = [
      {
        templeName: "Siddhivinayak Temple",
        location: "Maharashtra",
        description: "One of the most revered Ganesha temples in Mumbai, known for granting wishes to devotees.",
        openTime: "5:30 AM",
        closeTime: "10:00 PM",
        image: "https://images.unsplash.com/photo-1599454100806-56d09b4227a5?w=400",
        liveStreamUrl: ""
      },
      {
        templeName: "Somnath Temple",
        location: "Gujarat",
        description: "The first among the twelve Jyotirlinga shrines of Lord Shiva, located on the western coast.",
        openTime: "6:00 AM",
        closeTime: "9:00 PM",
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400",
        liveStreamUrl: ""
      },
      {
        templeName: "Tirumala Venkateswara Temple",
        location: "Andhra Pradesh",
        description: "One of the richest temples in the world, dedicated to Lord Venkateswara, an incarnation of Vishnu.",
        openTime: "2:30 AM",
        closeTime: "11:00 PM",
        image: "https://images.unsplash.com/photo-1599454100806-56d09b4227a5?w=400",
        liveStreamUrl: ""
      },
      {
        templeName: "Kashi Vishwanath Temple",
        location: "Uttar Pradesh",
        description: "One of the most famous Hindu temples dedicated to Lord Shiva, located on the banks of Ganga.",
        openTime: "4:00 AM",
        closeTime: "11:00 PM",
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400",
        liveStreamUrl: ""
      },
      {
        templeName: "Meenakshi Temple",
        location: "Tamil Nadu",
        description: "Ancient temple dedicated to Goddess Meenakshi and Lord Sundareswarar in Madurai.",
        openTime: "5:00 AM",
        closeTime: "10:00 PM",
        image: "https://images.unsplash.com/photo-1599454100806-56d09b4227a5?w=400",
        liveStreamUrl: ""
      }
    ];

    await Temple.insertMany(temples);
    console.log('Sample temples added successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding temples:', error);
    process.exit(1);
  }
};

seedTemples();
