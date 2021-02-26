const mongoose = require("../services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = {
  toJSON: {
    virtuals: true, //this adds the "id" field
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; //since id is added, this _id is not required
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
  setDefaultsOnInsert: true,
};

let quoteSchema = new Schema(
  {
    quote: { type: String, unique: false, required: true },
    category: { type: String, default: "WELLBEING" },
    imageLink: { type: String, default: "https://www.google.com" },
    twitterLink: { type: String, unique: false, required: true },
    publishedDate: { type: Date, unique: false, required: true },
  },
  opts
);

let Quote = mongoose.model("Quote", quoteSchema);

exports.insert = (quoteData) => {
  let quote = new Quote(quoteData);
  return quote.save();
};

exports.delete = (quoteId) => {
  return new Promise((resolve, reject) => {
    Quote.deleteMany({ _id: quoteId }).exec((err, deletedQuote) => {
      if (err) reject(err);
      resolve(deletedQuote);
    });
  });
};

exports.findByDate = (value) => {
  return Quote.findOne({ publishedDate: value });
};

exports.findByCategory = (value) => {
  return Quote.findOne({ category: value });
};

exports.findById = (memberId) => {
  return Member.findById({ _id: memberId });
};

exports.update = (memberId, newValues) => {
  return Quote.findByIdAndUpdate({ _id: memberId }, newValues);
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Quote.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec((err, quotes) => {
        if (err) reject(err);
        else resolve(quotes);
      });
  });
};

exports.getQuoteCount = () => {
  return Quote.countDocuments();
};
