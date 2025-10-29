import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import Experience from './models/Experience';
import Booking from './models/Booking';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Parses incoming JSON bodies

// --- API ENDPOINTS ---

/**
 * @route   GET /api/experiences
 * @desc    Get all experiences
 */
app.get('/api/experiences', async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/experiences/:id
 * @desc    Get a single experience by ID
 */
app.get('/api/experiences/:id', async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ msg: 'Experience not found' });
    }
    res.json(experience);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/promo/validate
 * @desc    Validate a promo code
 */
app.post('/api/promo/validate', (req: Request, res: Response) => {
  const { promoCode } = req.body;
  
  // Simple mock validation
  if (promoCode === 'SAVE10') {
    return res.json({ valid: true, discount: 10 }); // 10% discount
  }
  if (promoCode === 'FLAT100') {
    return res.json({ valid: true, discount: 100 }); // 100 currency discount
  }
  
  return res.status(400).json({ valid: false, message: 'Invalid promo code' });
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 */
app.post('/api/bookings', async (req: Request, res: Response) => {
  const { experienceId, date, time, quantity, totalPrice, user } = req.body;

  try {
    // 1. Find the specific slot for this experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const slot = experience.slots.find(s => s.date === date && s.time === time);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // 2. Check for double-booking (as required)
    if (slot.remaining < quantity) {
      return res.status(400).json({ message: 'Not enough available slots' });
    }

    // 3. Create and save the new booking
    const refId = `HW-${Date.now().toString().slice(-6)}`; // Simple Ref ID
    
    const newBooking = new Booking({
      experienceId,
      date,
      time,
      quantity,
      totalPrice,
      user,
      refId,
    });
    
    await newBooking.save();

    // 4. Update the slot availability
    slot.remaining -= quantity;
    await experience.save();

    res.status(201).json({ status: 'success', refId });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/seed
 * @desc    (One-time) Add manual data to the database
 */
app.post('/api/seed', async (req, res) => {
  const manualData = [
    {
      "title": "Kayaking in Mangroves",
      "location": "Udupi",
      "description": "Curated small-group experience. Certified guide. Safety first with gear included.",
      "about": "Scenic routes, trained guides, and safety briefing. Minimum age 10. A 2-hour guided tour.",
      "basePrice": 999,
      "imageUrl": "/kayaking.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "07:00 am", "remaining": 10 },
        { "date": "Oct 28", "time": "09:00 am", "remaining": 2 },
        { "date": "Oct 28", "time": "11:00 am", "remaining": 0 },
        { "date": "Oct 29", "time": "07:00 am", "remaining": 12 },
        { "date": "Oct 29", "time": "09:00 am", "remaining": 8 },
        { "date": "Oct 30", "time": "07:00 am", "remaining": 10 }
      ]
    },
    {
      "title": "Nandi Hills Sunrise",
      "location": "Bangalore",
      "description": "Witness the breathtaking sunrise from the peak of Nandi Hills. A classic Bangalore escape.",
      "about": "Early morning pickup, guided trek to the viewpoint, and light breakfast included. 3-hour experience.",
      "basePrice": 899,
      "imageUrl": "/nandi_hills.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "04:00 am", "remaining": 20 },
        { "date": "Oct 29", "time": "04:00 am", "remaining": 15 },
        { "date": "Oct 30", "time": "04:00 am", "remaining": 5 },
        { "date": "Oct 31", "time": "04:00 am", "remaining": 0 }
      ]
    },
    {
      "title": "Coorg Coffee Trail",
      "location": "Coorg",
      "description": "Walk through lush coffee estates, learn about bean-to-cup, and enjoy fresh-brewed coffee.",
      "about": "A 90-minute walking tour with a local guide. Learn to pick coffee cherries (seasonal).",
      "basePrice": 1299,
      "imageUrl": "/coorg.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "10:00 am", "remaining": 8 },
        { "date": "Oct 28", "time": "02:00 pm", "remaining": 6 },
        { "date": "Oct 29", "time": "10:00 am", "remaining": 8 }
      ]
    },
    {
      "title": "Backwaters Boat Cruise",
      "location": "Sunderban",
      "description": "Explore the dense Sunderban mangroves and spot local wildlife from a safe boat.",
      "about": "Full-day trip with a guide, safety gear, and packed lunch. Chance to see crocodiles and birds.",
      "basePrice": 1999,
      "imageUrl": "/backwaters.jpeg",
      "slots": [
        { "date": "Oct 30", "time": "08:00 am", "remaining": 10 },
        { "date": "Oct 31", "time": "08:00 am", "remaining": 10 }
      ]
    },
    {
      "title": "Bungee Jumping",
      "location": "Manali",
      "description": "Experience the ultimate thrill with a giant leap from a platform over the Himalayas.",
      "about": "Certified instructors and top-quality safety equipment. Must be over 18. Weight limits apply.",
      "basePrice": 3500,
      "imageUrl": "/bungjee.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "10:00 am", "remaining": 5 },
        { "date": "Oct 28", "time": "11:00 am", "remaining": 3 },
        { "date": "Oct 28", "time": "12:00 pm", "remaining": 2 },
        { "date": "Oct 29", "time": "10:00 am", "remaining": 5 }
      ]
    },
    {
      "title": "Forest Kayaking",
      "location": "Karnataka",
      "description": "A serene kayaking experience through a submerged forest. Perfect for nature lovers.",
      "about": "Located near Udupi. All gear provided. Guide will accompany the group. 2-hour slot.",
      "basePrice": 999,
      "imageUrl": "/forest.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "08:00 am", "remaining": 10 },
        { "date": "Oct 29", "time": "08:00 am", "remaining": 10 }
      ]
    },
    {
      "title": "Scuba Diving (Intro)",
      "location": "Goa",
      "description": "Discover the underwater world with a PADI-certified instructor. No prior experience needed.",
      "about": "Includes 30 minutes of training and 45 minutes of diving. All equipment provided.",
      "basePrice": 2500,
      "imageUrl": "/scuba.jpeg",
      "slots": [
        { "date": "Oct 30", "time": "09:00 am", "remaining": 6 },
        { "date": "Oct 30", "time": "12:00 pm", "remaining": 4 },
        { "date": "Oct 31", "time": "09:00 am", "remaining": 6 }
      ]
    },
    {
      "title": "River Rafting",
      "location": "Rishikesh",
      "description": "Tackle the thrilling rapids of the Ganges. An adventure you won't forget!",
      "about": "16km rafting route with Grade III rapids. Includes cliff jumping. All safety gear provided.",
      "basePrice": 1600,
      "imageUrl": "/river.jpeg",
      "slots": [
        { "date": "Oct 28", "time": "09:00 am", "remaining": 0 },
        { "date": "Oct 29", "time": "09:00 am", "remaining": 12 },
        { "date": "Oct 30", "time": "09:00 am", "remaining": 15 }
      ]
    }
  ];

  try {
    await Experience.deleteMany({}); // Clear existing
    await Experience.insertMany(manualData);
    res.status(201).send('Database Seeded Successfully!');
  } catch (err) {
    res.status(500).send('Error seeding database');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));