import mongoose from 'mongoose';
import { app } from './app';
import { CONFIG } from './config';


const start = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('Database connected');
    
  } catch (err) {
    console.log(err);  
  }

  app.listen(CONFIG.PORT, () => {
    console.log(`Listening on port ${CONFIG.PORT}!!!`);
  });
}

start();