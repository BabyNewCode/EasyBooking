const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    console.log('📝 Tentative d\'inscription avec:', { username, email });

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      console.warn('❌ Champs manquants');
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password !== passwordConfirm) {
      console.warn('❌ Les mots de passe ne correspondent pas');
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.warn('❌ L\'utilisateur existe déjà');
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    // Create user
    console.log('✏️  Création de l\'utilisateur en BD...');
    user = new User({ username, email, password });
    await user.save();
    console.log('✅ Utilisateur sauvegardé avec ID:', user._id);

    const token = generateToken(user._id);
    console.log('✅ Token généré');
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error.message);
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
