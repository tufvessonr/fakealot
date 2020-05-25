const ENV = new class {
  public readonly PORT = '3000';
  public readonly JWT_KEY = '';
  public readonly MONGO_URI = '';

  constructor() {
    const keys = Object.keys(this);
    const missing: string[] = [];
    for (const k of keys) {
      const v = process.env[k] || (this as any)[k];
      if (!v) {
        missing.push(k);
      } else {
        (this as any)[k] = v;
      }
    }
    
    if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
      throw new Error(`Required environment variables missing: ['${missing.join("','")}']`);
    }
  }
}();

const BUILD = new class {
  public readonly IS_TEST_ENV = false;

  public readonly PORT = ENV.PORT;
  public readonly JWT_KEY = ENV.JWT_KEY;
  public readonly MONGO_URI = ENV.MONGO_URI;
}();

const TEST = new class {
  public readonly IS_TEST_ENV = true;
  
  public readonly PORT = ENV.PORT;
  public readonly JWT_KEY = 'asdf';
  public readonly MONGO_URI = ENV.MONGO_URI;
}();
 

export const CONFIG = process.env.NODE_ENV  === 'test' ? TEST : BUILD;
