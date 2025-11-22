const { z } = require('zod');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  };
};

// Auth validation schemas
const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(100),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  updateProfile: z.object({
    body: z.object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).max(100).optional(),
    }),
  }),
};

// Question validation schemas
const questionSchemas = {
  create: z.object({
    body: z.object({
      subject: z.string().min(1, 'Subject is required'),
      topic: z.string().min(1, 'Topic is required'),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      question: z.string().min(10, 'Question must be at least 10 characters'),
      options: z.array(z.string()).min(2).max(6),
      correctAnswer: z.string().min(1, 'Correct answer is required'),
      explanation: z.string().optional(),
    }),
  }),

  filter: z.object({
    query: z.object({
      subject: z.string().optional(),
      topic: z.string().optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
    }),
  }),
};

// Exam validation schemas
const examSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      duration: z.number().min(1, 'Duration must be at least 1 minute'),
      questionIds: z.array(z.string()).min(1, 'At least one question is required'),
    }),
  }),

  submit: z.object({
    body: z.object({
      examId: z.string().min(1, 'Exam ID is required'),
      answers: z.record(z.string(), z.string()),
    }),
  }),
};

module.exports = {
  validate,
  authSchemas,
  questionSchemas,
  examSchemas,
};
