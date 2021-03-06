import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error(
      'JWT_KEY must be defined. Use kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf'
    );
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined. Use the depl.yaml files');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to Auth MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening for Auth on port 3000!');
  });
};

start();
