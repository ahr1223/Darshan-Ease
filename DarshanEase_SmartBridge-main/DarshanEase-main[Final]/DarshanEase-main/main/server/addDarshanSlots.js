const mongoose = require('mongoose');
const Temple = require('./models/Temple');
const Darshan = require('./models/darshan');
require('dotenv').config();

const addDarshanSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all temples
    const temples = await Temple.find({});
    console.log(`Found ${temples.length} temples`);

    // Clear existing darshans
    await Darshan.deleteMany({});
    console.log('Cleared existing darshan slots');

    // Add darshan slots for each temple
    const darshanSlots = [];
    
    temples.forEach((temple, templeIndex) => {
      const templeId = temple._id;
      
      // Different slot types for each temple
      const slotTypes = [
        { name: 'Morning Darshan', openTime: '6:00 AM', closeTime: '8:00 AM', normalPrice: 0, vipPrice: 200 },
        { name: 'General Darshan', openTime: '8:00 AM', closeTime: '12:00 PM', normalPrice: 0, vipPrice: 300 },
        { name: 'Evening Aarti', openTime: '5:00 PM', closeTime: '6:00 PM', normalPrice: 100, vipPrice: 500 },
        { name: 'Special Entry', openTime: '10:00 AM', closeTime: '10:00 PM', normalPrice: 300, vipPrice: 600 },
        { name: 'VIP Darshan', openTime: '7:00 AM', closeTime: '9:00 AM', normalPrice: 500, vipPrice: 1000 }
      ];

      // Add 3-4 slots per temple
      const numSlots = Math.floor(Math.random() * 2) + 3; // 3-4 slots per temple
      
      for (let i = 0; i < numSlots; i++) {
        const slotType = slotTypes[i % slotTypes.length];
        darshanSlots.push({
          templeId: templeId,
          darshanName: slotType.name,
          openTime: slotType.openTime,
          closeTime: slotType.closeTime,
          normalPrice: slotType.normalPrice,
          vipPrice: slotType.vipPrice,
          capacity: 100,
          availableSeats: 100,
          description: `${slotType.name} at ${temple.templeName}`
        });
      }
    });

    // Insert all darshan slots
    await Darshan.insertMany(darshanSlots);
    console.log(`✅ Added ${darshanSlots.length} darshan slots across ${temples.length} temples`);
    
    // Show summary
    const summary = {};
    darshanSlots.forEach(slot => {
      const templeName = temples.find(t => t._id.toString() === slot.templeId.toString())?.templeName;
      if (templeName) {
        if (!summary[templeName]) summary[templeName] = 0;
        summary[templeName]++;
      }
    });
    
    console.log('\n📋 Darshan Slots Summary:');
    Object.entries(summary).forEach(([temple, count]) => {
      console.log(`  ${temple}: ${count} slots`);
    });

  } catch (error) {
    console.error('❌ Error adding darshan slots:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

addDarshanSlots();
