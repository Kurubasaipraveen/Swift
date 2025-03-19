const express = require('express');
const { connectDB } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api', routes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
