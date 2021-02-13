import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error(
      'JWT_KEY must be defined. Use kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf'
    );
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI must be defined. Use the depl.yaml files'
    );
  }

  if (!process.env.NATS_URI) {
    throw new Error('NATS_URI must be defined. Use the depl.yaml files');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined. Use the depl.yaml files');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined. Use the depl.yaml files');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    console.log('Connected to Tickets NATS');
  } catch (err) {
    console.error(err);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to Tickets MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening for Tickets on port 3000!');
  });
};

start();
