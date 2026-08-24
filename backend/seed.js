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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // ── Step 1: Create Trainer profiles (Trainer collection) ─────────────────
    const trainers = await Trainer.create([
      { name: 'Alex Vance',     specialization: 'CrossFit & High Intensity', available: true  },
      { name: 'Sarah Connor',   specialization: 'Yoga & Pilates',            available: true  },
      { name: 'Marcus Brody',   specialization: 'Weightlifting & Powerlifting', available: false },
      { name: 'Elena Rostova',  specialization: 'Cardio & Endurance',        available: true  },
    ]);
    console.log(`Created ${trainers.length} trainer profiles`);

    // ── Step 2: Create Member accounts ───────────────────────────────────────
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
    console.log(`Created ${members.length} member accounts`);

    // ── Step 3: Create Trainer login accounts (linked to Trainer profiles) ───
    const trainerAccounts = await Member.create([
      {
        name: trainers[0].name,
        email: 'alex@fitzone.com',
        phone: '9111111111',
        password: hashedPassword,
        role: 'trainer',
        membershipType: 'platinum',
        trainerProfileId: trainers[0]._id
      },
      {
        name: trainers[1].name,
        email: 'sarah@fitzone.com',
        phone: '9222222222',
        password: hashedPassword,
        role: 'trainer',
        membershipType: 'platinum',
        trainerProfileId: trainers[1]._id
      },
      {
        name: trainers[2].name,
        email: 'marcus@fitzone.com',
        phone: '9333333333',
        password: hashedPassword,
        role: 'trainer',
        membershipType: 'platinum',
        trainerProfileId: trainers[2]._id
      },
      {
        name: trainers[3].name,
        email: 'elena@fitzone.com',
        phone: '9444444444',
        password: hashedPassword,
        role: 'trainer',
        membershipType: 'platinum',
        trainerProfileId: trainers[3]._id
      },
    ]);
    console.log(`Created ${trainerAccounts.length} trainer login accounts`);

    // ── Step 4: Sample Bookings ───────────────────────────────────────────────
    await ClassBooking.create([
      {
        memberId: members[0]._id,
        trainerId: trainers[0]._id,
        className: 'Morning HIIT Blast',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '07:00 AM - 08:00 AM',
        status: 'booked'
      },
      {
        memberId: members[1]._id,
        trainerId: trainers[1]._id,
        className: 'Yoga Flow Session',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 AM - 10:00 AM',
        status: 'attended'
      }
    ]);
    console.log('Created 2 sample bookings');

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('📌 Login Credentials (password: 123456)');
    console.log('─────────────────────────────────────────');
    console.log('👤 MEMBERS:');
    console.log('   john@fitzone.com   (Platinum Member)');
    console.log('   jane@fitzone.com   (Premium Member)');
    console.log('🏋️  TRAINERS:');
    console.log('   alex@fitzone.com   (CrossFit & HIIT)');
    console.log('   sarah@fitzone.com  (Yoga & Pilates)');
    console.log('   marcus@fitzone.com (Weightlifting)');
    console.log('   elena@fitzone.com  (Cardio)');
    console.log('🛡️  ADMIN:');
    console.log('   admin@fitzone.com  (System Admin)');
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
