const dotenv = require('dotenv');
const { app, connectDB } = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
