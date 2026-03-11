const mongoose = require('mongoose');
const Temple = require('./models/Temple');
require('dotenv').config();

const updateTempleImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update existing temples with local image paths
    const updates = [
      {
        templeName: 'Siddhivinayak Temple',
        image: '/assets/temple-1.jpg'
      },
      {
        templeName: 'Somnath Temple',
        image: '/assets/temple-2.jpg'
      },
      {
        templeName: 'Tirumala Venkateswara Temple',
        image: '/assets/temple-3.jpg'
      },
      {
        templeName: 'Kashi Vishwanath Temple',
        image: '/assets/temple-4.jpg'
      },
      {
        templeName: 'Meenakshi Temple',
        image: '/assets/temple-5.jpg'
      }
    ];

    for (const update of updates) {
      await Temple.updateOne(
        { templeName: update.templeName },
        { $set: { image: update.image } }
      );
      console.log(`Updated ${update.templeName} with ${update.image}`);
    }

    console.log('All temple images updated successfully');
  } catch (error) {
    console.error('Error updating temple images:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateTempleImages();
