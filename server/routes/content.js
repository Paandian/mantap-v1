const express = require('express');
const {
  getTutors,
  getMentors,
  getSchools,
  getMerchants,
  getBooks,
  getTestimonials,
  getTools
} = require('../controllers/contentController');

const router = express.Router();

router.get('/tutors', getTutors);
router.get('/mentors', getMentors);
router.get('/schools', getSchools);
router.get('/merchants', getMerchants);
router.get('/books', getBooks);
router.get('/testimonials', getTestimonials);
router.get('/tools', getTools);

module.exports = router;