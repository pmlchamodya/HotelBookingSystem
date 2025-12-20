import express from 'express';
import Facility from '../models/Facility.js';

const router = express.Router();

// Test route - add this first
router.get('/test', (req, res) => {
  res.json({ message: 'Facilities API is working!' });
});

// GET all active facilities (Public)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching facilities...');
    const facilities = await Facility.find({ isActive: true });
    console.log(`Found ${facilities.length} facilities`);
    res.json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new facility (Admin)
router.post('/', async (req, res) => {
  try {
    console.log('Creating facility:', req.body);
    const facility = new Facility(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;