import mongoose from 'mongoose';

export interface BasketAttrs {
  userId: string;
  itemId: string;
}

interface BasketModel extends mongoose.Model<BasketDoc> {
  build(attrs: BasketAttrs): BasketDoc
}

export interface BasketDoc extends mongoose.Document {
  userId: string;
  itemId: string;
}

export const basketSchema = new mongoose.Schema({
  userId: {
      type: String,
      required: true,
    },
  itemId: {
      type: String,
      required: true,
    }
},
{
  toJSON: {
    transform(doc: BasketDoc, ret: any) {
      ret.id = doc._id

      delete ret._id;
      delete ret.__v;
    }
  }
});

basketSchema.pre('save', async function(done){  
  done();
});

basketSchema.statics.build = (attrs: BasketAttrs) => {
  return new Basket(attrs);
}

const Basket = mongoose.model<BasketDoc, BasketModel>('Basket', basketSchema);

export { Basket };

