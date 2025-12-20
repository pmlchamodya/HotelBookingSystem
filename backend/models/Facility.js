import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  icon: {
    type: String,
    default: 'fas fa-star'
  },
  category: {
    type: String,
    default: 'Wellness'
  },
  features: [String],
  timings: {
    type: String,
    default: '24/7'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Facility', facilitySchema);