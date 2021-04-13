module.exports = {
  local: {
    SG_PRIVATE_KEY: "sadhguru",
  },
  production: {
    SG_PRIVATE_KEY: process.env.SG_PRIVATE_KEY,
  },
};
