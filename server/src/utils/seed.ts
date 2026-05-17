import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead';
import User from '../models/User';

dotenv.config();

const dummyLeads = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', status: 'New', source: 'Website', createdAt: new Date('2024-05-01') },
  { name: 'Ishani Gupta', email: 'ishani.gupta@example.com', status: 'Contacted', source: 'Instagram', createdAt: new Date('2024-05-02') },
  { name: 'Vivaan Kapoor', email: 'vivaan.kapoor@example.com', status: 'Qualified', source: 'Referral', createdAt: new Date('2024-05-03') },
  { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', status: 'Lost', source: 'Website', createdAt: new Date('2024-05-04') },
  { name: 'Kabir Verma', email: 'kabir.verma@example.com', status: 'New', source: 'Instagram', createdAt: new Date('2024-05-05') },
  { name: 'Saira Malhotra', email: 'saira.malhotra@example.com', status: 'Contacted', source: 'Referral', createdAt: new Date('2024-05-06') },
  { name: 'Arjun Reddy', email: 'arjun.reddy@example.com', status: 'Qualified', source: 'Website', createdAt: new Date('2024-05-07') },
  { name: 'Myra Khan', email: 'myra.khan@example.com', status: 'New', source: 'Instagram', createdAt: new Date('2024-05-08') },
  { name: 'Reyansh Singhania', email: 'reyansh.singh@example.com', status: 'Contacted', source: 'Referral', createdAt: new Date('2024-05-09') },
  { name: 'Kiara Joshi', email: 'kiara.joshi@example.com', status: 'Qualified', source: 'Website', createdAt: new Date('2024-05-10') },
  { name: 'Advait Rao', email: 'advait.rao@example.com', status: 'Lost', source: 'Instagram', createdAt: new Date('2024-05-11') },
  { name: 'Zoya Agarwal', email: 'zoya.agarwal@example.com', status: 'New', source: 'Referral', createdAt: new Date('2024-05-12') },
  { name: 'Ishaan Deshmukh', email: 'ishaan.d@example.com', status: 'Contacted', source: 'Website', createdAt: new Date('2024-05-13') },
  { name: 'Diya Saxena', email: 'diya.saxena@example.com', status: 'Qualified', source: 'Instagram', createdAt: new Date('2024-05-14') },
  { name: 'Ranveer Chauhan', email: 'ranveer.c@example.com', status: 'New', source: 'Referral', createdAt: new Date('2024-05-15') },
];

const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: '123456',
    role: 'Admin' as const,
  },
  {
    name: 'Sales User',
    email: 'sales@test.com',
    password: '123456',
    role: 'Sales' as const,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB for seeding...');

    await Lead.deleteMany();
    await Lead.insertMany(dummyLeads);
    console.log('Successfully seeded 15 dummy leads!');

    await User.deleteMany();
    for (const userData of dummyUsers) {
      await User.create(userData);
    }
    console.log('Successfully seeded Demo Credentials!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
