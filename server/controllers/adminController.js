const Tutor = require('../models/Tutor');
const Mentor = require('../models/Mentor');
const School = require('../models/School');
const Merchant = require('../models/Merchant');
const Book = require('../models/Book');
const Testimonial = require('../models/Testimonial');

// Tutors CRUD
const createTutor = async (req, res) => {
  const { name, bio, rating, image_url, verification_status } = req.body;
  try {
    const id = await Tutor.create(name, bio, rating, image_url, verification_status);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTutor = async (req, res) => {
  const { id } = req.params;
  const { name, bio, rating, image_url, verification_status } = req.body;
  try {
    await Tutor.update(id, name, bio, rating, image_url, verification_status);
    res.json({ message: 'Tutor updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTutor = async (req, res) => {
  const { id } = req.params;
  try {
    await Tutor.delete(id);
    res.json({ message: 'Tutor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mentors CRUD
const createMentor = async (req, res) => {
  const { name, bio, rating, image_url, specialty } = req.body;
  try {
    const id = await Mentor.create(name, bio, rating, image_url, specialty);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMentor = async (req, res) => {
  const { id } = req.params;
  const { name, bio, rating, image_url, specialty } = req.body;
  try {
    await Mentor.update(id, name, bio, rating, image_url, specialty);
    res.json({ message: 'Mentor updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMentor = async (req, res) => {
  const { id } = req.params;
  try {
    await Mentor.delete(id);
    res.json({ message: 'Mentor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Schools CRUD
const createSchool = async (req, res) => {
  const { name, location, claimed_status, rating, image_url } = req.body;
  try {
    const id = await School.create(name, location, claimed_status, rating, image_url);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, location, claimed_status, rating, image_url } = req.body;
  try {
    await School.update(id, name, location, claimed_status, rating, image_url);
    res.json({ message: 'School updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    await School.delete(id);
    res.json({ message: 'School deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Merchants CRUD
const createMerchant = async (req, res) => {
  const { name, description, verified_status, rating, price, image_url } = req.body;
  try {
    const id = await Merchant.create(name, description, verified_status, rating, price, image_url);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMerchant = async (req, res) => {
  const { id } = req.params;
  const { name, description, verified_status, rating, price, image_url } = req.body;
  try {
    await Merchant.update(id, name, description, verified_status, rating, price, image_url);
    res.json({ message: 'Merchant updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMerchant = async (req, res) => {
  const { id } = req.params;
  try {
    await Merchant.delete(id);
    res.json({ message: 'Merchant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Books CRUD
const createBook = async (req, res) => {
  const { title, publisher, verified_status, rating, description, price, image_url } = req.body;
  try {
    const id = await Book.create(title, publisher, verified_status, rating, description, price, image_url);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, publisher, verified_status, rating, description, price, image_url } = req.body;
  try {
    await Book.update(id, title, publisher, verified_status, rating, description, price, image_url);
    res.json({ message: 'Book updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await Book.delete(id);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Testimonials CRUD
const createTestimonial = async (req, res) => {
  const { name, role, content, image_url } = req.body;
  try {
    const id = await Testimonial.create(name, role, content, image_url);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, role, content, image_url } = req.body;
  try {
    await Testimonial.update(id, name, role, content, image_url);
    res.json({ message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    await Testimonial.delete(id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTutor, updateTutor, deleteTutor,
  createMentor, updateMentor, deleteMentor,
  createSchool, updateSchool, deleteSchool,
  createMerchant, updateMerchant, deleteMerchant,
  createBook, updateBook, deleteBook,
  createTestimonial, updateTestimonial, deleteTestimonial
};