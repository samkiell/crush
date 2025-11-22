const express = require('express');
const { validate, questionSchemas } = require('../../middleware/validation');
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsBySubject,
} = require('./controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes (for authenticated users)
router.get('/', authMiddleware, validate(questionSchemas.filter), getAllQuestions);
router.get('/subject/:subject', authMiddleware, getQuestionsBySubject);
router.get('/:id', authMiddleware, getQuestionById);

// Admin routes (require admin role - add role check middleware later)
router.post('/', authMiddleware, validate(questionSchemas.create), createQuestion);
router.put('/:id', authMiddleware, validate(questionSchemas.create), updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

module.exports = router;
