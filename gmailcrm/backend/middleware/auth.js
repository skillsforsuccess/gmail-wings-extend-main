function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing Bearer token' });
  }

  req.user = { token: authHeader.slice('Bearer '.length) };
  return next();
}

module.exports = {
  authenticateJwt,
};
