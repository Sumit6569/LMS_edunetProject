import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Art', 'Music', 'Film', 'Games', 'Publishing', 'Fashion', 'Food', 'Other']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  deadline: {
    type: Date,
    required: true
  },
  backers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rewards: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    amount: {
      type: Number,
      required: true
    },
    estimatedDelivery: Date,
    shippingInfo: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'expired'],
    default: 'draft'
  },
  tags: [{
    type: String
  }],
  faqs: [{
    question: String,
    answer: String
  }]
}, {
  timestamps: true
});

// Add indexes for better search performance
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to check if project is funded
projectSchema.methods.isFunded = function() {
  return this.currentAmount >= this.targetAmount;
};

// Method to check if project has expired
projectSchema.methods.isExpired = function() {
  return new Date() > this.deadline;
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
