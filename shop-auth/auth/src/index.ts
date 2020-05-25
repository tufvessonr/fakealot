import mongoose from 'mongoose';
import { app } from './app';
import { CONFIG } from './config';
import { initAuthService } from './setup/setup';


const start = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');

    initAuthService();
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
