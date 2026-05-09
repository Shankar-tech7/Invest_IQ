const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'InvestIQ Backend Online' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
