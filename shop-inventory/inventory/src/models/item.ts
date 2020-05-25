import isBase64 from 'is-base64';
import mongoose from 'mongoose';

interface ItemAttrs {
  name: string;
  description: string;
  brand: string;
  quantity: number;
  price: number;
  discountFixed?: number;
  discountPercentage?: number;
  images?: string[];
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc
}

interface ItemDoc extends mongoose.Document {
  name: string;
  description: string;
  brand: string;
  quantity: number;
  price: number;
  discountFixed: number;
  discountPercentage: number;
  images: string[];
}

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  discount_fixed: {
    type: Number,
    default: 0
  },
  discount_percentage: {
    type: Number,
    default: 0
  },
  images: {
    type: [Buffer],
    default: []
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
  if(this.isModified('images')){
    const images: string[] = this.get('images');
    let image;
    for(let key in images){
      image = images[key];
      if(!isBase64(image)){
        images[key] = btoa(image);
      }
    }
    this.set('images', images);
  }

  done();
});

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
}

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };

