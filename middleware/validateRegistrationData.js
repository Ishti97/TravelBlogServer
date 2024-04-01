const validateRegistrationData = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long' });
  }

  const validRoles = ['ADMIN', 'USER', 'AUTHOR'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Role must be one of  "ADMIN", "USER", or "AUTHOR"' });
  }

  next();
};

module.exports = {
  validateRegistrationData
};
