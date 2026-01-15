const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
  body('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit avoir au moins 3 caractères'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit avoir au moins 6 caractères')
], authController.signup);

router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').exists().withMessage('Le mot de passe est requis')
], authController.login);

router.get('/profile', require('../middleware/authenticate'), authController.getProfile);

module.exports = router;
