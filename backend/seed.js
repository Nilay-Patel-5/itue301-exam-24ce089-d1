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

    // ── Step 2: Create Member accounts (Basic, Premium, Platinum) ─────────────
    const members = await Member.create([
      // Platinum Members
      {
        name: 'John Doe',
        email: 'john@fitzone.com',
        phone: '9876543210',
        password: hashedPassword,
        membershipType: 'platinum',
        role: 'member'
      },
      {
        name: 'Alice Johnson',
        email: 'alice@fitzone.com',
        phone: '9876543212',
        password: hashedPassword,
        membershipType: 'platinum',
        role: 'member'
      },
      // Premium Members
      {
        name: 'Jane Smith',
        email: 'jane@fitzone.com',
        phone: '9876543211',
        password: hashedPassword,
        membershipType: 'premium',
        role: 'member'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@fitzone.com',
        phone: '9876543213',
        password: hashedPassword,
        membershipType: 'premium',
        role: 'member'
      },
      // Basic Members
      {
        name: 'Charlie Brown',
        email: 'charlie@fitzone.com',
        phone: '9876543214',
        password: hashedPassword,
        membershipType: 'basic',
        role: 'member'
      },
      {
        name: 'Diana Prince',
        email: 'diana@fitzone.com',
        phone: '9876543215',
        password: hashedPassword,
        membershipType: 'basic',
        role: 'member'
      },
      // System Admin (No membership type)
      {
        name: 'Admin User',
        email: 'admin@fitzone.com',
        phone: '9999999999',
        password: hashedPassword,
        membershipType: null,
        role: 'admin'
      }
    ]);
    console.log(`Created ${members.length} member & admin accounts`);

    // ── Step 3: Create Trainer login accounts (NO membershipType) ─────────────
    const trainerAccounts = await Member.create([
      {
        name: trainers[0].name,
        email: 'alex@fitzone.com',
        phone: '9111111111',
        password: hashedPassword,
        role: 'trainer',
        membershipType: null,
        trainerProfileId: trainers[0]._id
      },
      {
        name: trainers[1].name,
        email: 'sarah@fitzone.com',
        phone: '9222222222',
        password: hashedPassword,
        role: 'trainer',
        membershipType: null,
        trainerProfileId: trainers[1]._id
      },
      {
        name: trainers[2].name,
        email: 'marcus@fitzone.com',
        phone: '9333333333',
        password: hashedPassword,
        role: 'trainer',
        membershipType: null,
        trainerProfileId: trainers[2]._id
      },
      {
        name: trainers[3].name,
        email: 'elena@fitzone.com',
        phone: '9444444444',
        password: hashedPassword,
        role: 'trainer',
        membershipType: null,
        trainerProfileId: trainers[3]._id
      },
    ]);
    console.log(`Created ${trainerAccounts.length} trainer login accounts`);

    // ── Step 4: Rich Sample Bookings ─────────────────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

    await ClassBooking.create([
      // Platinum Member: John Doe
      { memberId: members[0]._id, trainerId: trainers[0]._id, className: 'Morning HIIT Blast',       date: today,        timeSlot: '07:00 AM - 08:00 AM', status: 'booked'    },
      { memberId: members[0]._id, trainerId: trainers[1]._id, className: 'Yoga Flow Session',         date: yesterday,    timeSlot: '09:00 AM - 10:00 AM', status: 'attended'  },
      { memberId: members[0]._id, trainerId: trainers[3]._id, className: 'Endurance Run Circuit',     date: twoDaysAgo,   timeSlot: '06:30 PM - 07:30 PM', status: 'attended'  },

      // Platinum Member: Alice Johnson
      { memberId: members[1]._id, trainerId: trainers[0]._id, className: 'Advanced CrossFit',         date: tomorrow,     timeSlot: '08:00 AM - 09:00 AM', status: 'booked'    },
      { memberId: members[1]._id, trainerId: trainers[2]._id, className: 'Power Lifting Workshop',  date: today,        timeSlot: '04:00 PM - 05:00 PM', status: 'booked'    },

      // Premium Member: Jane Smith
      { memberId: members[2]._id, trainerId: trainers[1]._id, className: 'Morning Pilates Core',      date: today,        timeSlot: '09:00 AM - 10:00 AM', status: 'booked'    },
      { memberId: members[2]._id, trainerId: trainers[0]._id, className: 'CrossFit Strength',         date: today,        timeSlot: '05:00 PM - 06:00 PM', status: 'booked'    },
      { memberId: members[2]._id, trainerId: trainers[3]._id, className: 'Cardio Burn Session',       date: yesterday,    timeSlot: '07:00 AM - 08:00 AM', status: 'attended'  },

      // Premium Member: Bob Wilson
      { memberId: members[3]._id, trainerId: trainers[2]._id, className: 'Heavy Deadlift Training',   date: twoDaysAgo,   timeSlot: '05:00 PM - 06:00 PM', status: 'attended'  },
      { memberId: members[3]._id, trainerId: trainers[1]._id, className: 'Flexibility & Balance',     date: tomorrow,     timeSlot: '10:00 AM - 11:00 AM', status: 'booked'    },

      // Basic Member: Charlie Brown
      { memberId: members[4]._id, trainerId: trainers[3]._id, className: 'Beginner Endurance',       date: today,        timeSlot: '06:00 PM - 07:00 PM', status: 'booked'    },
      { memberId: members[4]._id, trainerId: trainers[1]._id, className: 'Basic Stretching',          date: threeDaysAgo, timeSlot: '09:00 AM - 10:00 AM', status: 'cancelled' },

      // Basic Member: Diana Prince
      { memberId: members[5]._id, trainerId: trainers[0]._id, className: 'Intro HIIT Class',          date: yesterday,    timeSlot: '11:00 AM - 12:00 PM', status: 'attended'  },
      { memberId: members[5]._id, trainerId: trainers[3]._id, className: 'Cardio Basics',             date: tomorrow,     timeSlot: '05:00 PM - 06:00 PM', status: 'booked'    },
    ]);
    console.log('Created 14 sample bookings for all membership tiers');

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('──────────────────────────────────────────────────');
    console.log('📌 Login Credentials (Password for all: 123456)');
    console.log('──────────────────────────────────────────────────');
    console.log('💎 PLATINUM MEMBERS:');
    console.log('   john@fitzone.com   (John Doe)');
    console.log('   alice@fitzone.com  (Alice Johnson)');
    console.log('⭐ PREMIUM MEMBERS:');
    console.log('   jane@fitzone.com   (Jane Smith)');
    console.log('   bob@fitzone.com    (Bob Wilson)');
    console.log('🏷️ BASIC MEMBERS:');
    console.log('   charlie@fitzone.com (Charlie Brown)');
    console.log('   diana@fitzone.com   (Diana Prince)');
    console.log('🏋️ TRAINERS (No Membership):');
    console.log('   alex@fitzone.com   (Alex Vance - CrossFit)');
    console.log('   sarah@fitzone.com  (Sarah Connor - Yoga)');
    console.log('   marcus@fitzone.com (Marcus Brody - Weightlifting)');
    console.log('   elena@fitzone.com  (Elena Rostova - Cardio)');
    console.log('🛡️ ADMIN (System Admin):');
    console.log('   admin@fitzone.com  (Admin User)');
    console.log('──────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
