const { app, connectDB } = require('../backend/app');

module.exports = async (req, res) => {
  await connectDB();
  if (req.query && req.query.path) {
    const subpath = req.query.path.startsWith('/') ? req.query.path : `/${req.query.path}`;
    req.url = `/api${subpath}`;
  }
  return app(req, res);
};
