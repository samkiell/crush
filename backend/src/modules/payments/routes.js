const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.post('/initialize', (req, res) => {
  res.json({ message: 'Payment initialization - Coming soon' });
});

router.get('verify/:reference', (req, res) => {
  res.json({ message: 'Payment verification - Coming soon' });
});

module.exports = router;
