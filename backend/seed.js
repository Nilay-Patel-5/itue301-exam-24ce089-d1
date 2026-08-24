const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const ClassBooking = require('./models/ClassBooking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitzone');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Member.deleteMany();
    await Trainer.deleteMany();
    await ClassBooking.deleteMany();
    console.log('Cleared existing collections...');

    // Create Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Create Members
    const members = await Member.create([
      {
        name: 'John Doe',
        email: 'john@fitzone.com',
        phone: '9876543210',
        password: hashedPassword,
        membershipType: 'platinum',
        role: 'member'
      },
      {
        name: 'Jane Smith',
        email: 'jane@fitzone.com',
        phone: '9876543211',
        password: hashedPassword,
        membershipType: 'premium',
        role: 'member'
      },
      {
        name: 'Admin User',
        email: 'admin@fitzone.com',
        phone: '9999999999',
        password: hashedPassword,
        membershipType: 'platinum',
        role: 'admin'
      }
    ]);

    console.log(`Created ${members.length} members`);

    // Create Trainers
    const trainers = await Trainer.create([
      {
        name: 'Alex Vance',
        specialization: 'CrossFit & High Intensity',
        available: true
      },
      {
        name: 'Sarah Connor',
        specialization: 'Yoga & Pilates',
        available: true
      },
      {
        name: 'Marcus Brody',
        specialization: 'Heavy Weightlifting & Powerlifting',
        available: false
      },
      {
        name: 'Elena Rostova',
        specialization: 'Cardio & Endurance',
        available: true
      }
    ]);

    console.log(`Created ${trainers.length} trainers`);

    // Create Sample Booking
    await ClassBooking.create({
      memberId: members[0]._id,
      trainerId: trainers[0]._id,
      className: 'Morning HIIT Blast',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '07:00 AM - 08:00 AM',
      status: 'booked'
    });

    console.log('Sample booking created!');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
