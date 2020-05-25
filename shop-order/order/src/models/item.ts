import mongoose from 'mongoose';

export interface ItemAttrs {
  name: string;
  brand: string;
  quantity: number;
  price: number;
  discounted: number;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc
}

export interface ItemDoc extends mongoose.Document {
  name: string;
  brand: string;
  quantity: number;
  price: number;
  discounted?: number;
}

export const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  discounted: {
    type: Number,
    default: 0
  }
},
{
  toJSON: {
    transform(doc: ItemDoc, ret: any) {
      ret.id = doc._id

      delete ret._id;
      delete ret.__v;
    }
  }
});

itemSchema.pre('save', async function(done){  
  done();
});

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
}

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };

