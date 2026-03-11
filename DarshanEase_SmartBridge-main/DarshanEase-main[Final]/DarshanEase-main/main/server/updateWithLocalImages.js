const mongoose = require('mongoose');
const Temple = require('./models/Temple');
require('dotenv').config();

const updateWithLocalImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing temples
    await Temple.deleteMany({});
    console.log('Cleared existing temples');

    // Add temples with your local images
    const temples = [
      {
        templeName: 'Siddhivinayak Temple',
        location: 'Maharashtra',
        description: 'One of the most revered Ganesha temples in Mumbai, known for granting wishes to devotees.',
        openTime: '5:30 AM',
        closeTime: '10:00 PM',
        image: '/assets/temple-1.jpg'
      },
      {
        templeName: 'Somnath Temple',
        location: 'Gujarat',
        description: 'The first among the twelve Jyotirlinga shrines of Lord Shiva, located on the western coast.',
        openTime: '6:00 AM',
        closeTime: '9:00 PM',
        image: '/assets/temple-2.jpg'
      },
      {
        templeName: 'Tirumala Venkateswara Temple',
        location: 'Andhra Pradesh',
        description: 'One of the richest temples in the world, dedicated to Lord Venkateswara.',
        openTime: '2:30 AM',
        closeTime: '11:00 PM',
        image: '/assets/temple-3.jpg'
      },
      {
        templeName: 'Kashi Vishwanath Temple',
        location: 'Uttar Pradesh',
        description: 'One of the most famous Hindu temples dedicated to Lord Shiva, located on the banks of the Ganga.',
        openTime: '4:00 AM',
        closeTime: '11:00 PM',
        image: '/assets/temple-4.jpg'
      },
      {
        templeName: 'Meenakshi Temple',
        location: 'Tamil Nadu',
        description: 'Ancient temple dedicated to Goddess Meenakshi and Lord Sundareswarar in Madurai.',
        openTime: '5:00 AM',
        closeTime: '10:00 PM',
        image: '/assets/temple-5.jpg'
      }
    ];

    await Temple.insertMany(temples);
    console.log('✅ Added temples with local images from assets folder');
    
    temples.forEach(t => {
      console.log(`📷 ${t.templeName} -> ${t.image}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateWithLocalImages();
