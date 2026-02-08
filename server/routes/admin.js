const express = require('express');
const {
  createTutor, updateTutor, deleteTutor,
  createMentor, updateMentor, deleteMentor,
  createSchool, updateSchool, deleteSchool,
  createMerchant, updateMerchant, deleteMerchant,
  createBook, updateBook, deleteBook,
  createTestimonial, updateTestimonial, deleteTestimonial
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Tutors
router.post('/tutors', createTutor);
router.put('/tutors/:id', updateTutor);
router.delete('/tutors/:id', deleteTutor);

// Mentors
router.post('/mentors', createMentor);
router.put('/mentors/:id', updateMentor);
router.delete('/mentors/:id', deleteMentor);

// Schools
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);

// Merchants
router.post('/merchants', createMerchant);
router.put('/merchants/:id', updateMerchant);
router.delete('/merchants/:id', deleteMerchant);

// Books
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// Testimonials
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

module.exports = router;