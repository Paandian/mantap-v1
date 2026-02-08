const Tutor = require('../models/Tutor');
const Mentor = require('../models/Mentor');
const School = require('../models/School');
const Merchant = require('../models/Merchant');
const Book = require('../models/Book');
const Testimonial = require('../models/Testimonial');
const Tool = require('../models/Tool');

const getTutors = async (req, res) => {
  try {
    const tutors = await Tutor.findAll();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.findAll();
    res.json(merchants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTools = async (req, res) => {
  try {
    const tools = await Tool.findAll();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTutors,
  getMentors,
  getSchools,
  getMerchants,
  getBooks,
  getTestimonials,
  getTools
};