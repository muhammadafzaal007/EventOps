import mongoose from 'mongoose';

const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventOps API is running',
    database: DB_STATES[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
};
