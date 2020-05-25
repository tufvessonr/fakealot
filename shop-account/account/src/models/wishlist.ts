import mongoose from 'mongoose';

interface WishListAttrs {
  userId: string;
  itemId: string;
}

interface WishListDoc extends mongoose.Document {
  userId: string;
  itemId: string;
}

interface WishListModel extends mongoose.Model<WishListDoc> {
  build(attrs: WishListAttrs): WishListDoc;
}

const wishListSchema = new mongoose.Schema(
  {
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
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

wishListSchema.statics.build = (attrs: WishListAttrs) => {
  return new WishList(attrs);
};

const WishList = mongoose.model<WishListDoc, WishListModel>(
  'WishList',
  wishListSchema
);

export { WishList };

