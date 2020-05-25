const ENV = new class {
  public readonly PORT = '3000';
  public readonly JWT_KEY = '';
  public readonly NATS_CLIENT_ID = '';
  public readonly NATS_URL = '';
  public readonly NATS_CLUSTER_ID = '';
  public readonly REDIS_HOST = '';

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

  public readonly NATS_CLIENT_ID = ENV.NATS_CLIENT_ID;
  public readonly NATS_URL = ENV.NATS_URL;
  public readonly NATS_CLUSTER_ID = ENV.NATS_CLUSTER_ID;
  public readonly REDIS_HOST = ENV.REDIS_HOST;
}();

const TEST = new class {
  public readonly IS_TEST_ENV = true;
  
  public readonly PORT = ENV.PORT;
  public readonly JWT_KEY = ENV.JWT_KEY;
  
  public readonly NATS_CLIENT_ID = ENV.NATS_CLIENT_ID;
  public readonly NATS_URL = ENV.NATS_URL;
  public readonly NATS_CLUSTER_ID = ENV.NATS_CLUSTER_ID;
  public readonly REDIS_HOST = ENV.REDIS_HOST;
}();
 

export const CONFIG = process.env.NODE_ENV  === 'test' ? TEST : BUILD;
