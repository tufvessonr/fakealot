const ENV = new class {
  public readonly PORT = '3000';
  public readonly JWT_KEY = '';
  public readonly MONGO_URI = '';
  public readonly ADMIN_USER = '';
  public readonly ADMIN_PASS = '';

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

  public readonly ADMIN_USER = ENV.ADMIN_USER;
  public readonly ADMIN_PASS = ENV.ADMIN_PASS;
}();

const TEST = new class {
  public readonly IS_TEST_ENV = true;

  public readonly PORT = ENV.PORT;
  public readonly JWT_KEY = 'asdf';
  public readonly MONGO_URI = 'mongodb://auth-mongo-srv:27017/auth';

  public readonly ADMIN_USER = 'test@test.com';
  public readonly ADMIN_PASS = 'password';
}();
 

export const CONFIG = process.env.NODE_ENV  === 'test' ? TEST : BUILD;
