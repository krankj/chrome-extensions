const mongoose = require("../services/mongoose.service").mongoose;
const beautifyUnique = require("mongoose-beautiful-unique-validation");

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
  //setDefaultsOnInsert: true, // not really sure if this field is required, since I checked that it works fine even without it.
};

let quoteSchema = new Schema(
  {
    quote: {
      type: String,
    },
    category: { type: String, default: "WELLBEING" },
    imageLink: { type: String, default: "" }, //use default https://pbs.twimg.com/profile_images/1132191777195085824/KbxIQUxJ_400x400.png if needed
    publishedDate: {
      type: Date,
      unique: "A quote for this date already exists ({VALUE})",
    },
    twitterLink: {
      type: String,
      unique: "A duplicate link already exists ({VALUE})",
    },
  },
  opts
);
quoteSchema.plugin(beautifyUnique);

//quoteSchema.index({ quote: 1 }, { unique: true });

let Quote = mongoose.model("Quote", quoteSchema);

exports.insert = (quoteData) => {
  let quote = new Quote(quoteData);
  return quote.save();
};

exports.insertMany = (quoteArray) => {
  return Quote.insertMany(quoteArray, { ordered: false });
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
