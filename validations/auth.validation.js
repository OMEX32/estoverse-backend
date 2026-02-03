const userConstraints = {
  username: {
    presence: { message: "is required" },
    length: {
      minimum: 3,
      maximum: 30,
      tooShort: "needs to be at least %{count} characters long",
      tooLong: "needs to be at most %{count} characters long",
    },
    format: {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "can only contain letters, numbers, and underscores",
    },
  },

  password: {
    presence: { message: "is required" },
    length: {
      minimum: 6,
      maximum: 30,
      tooShort: "needs to be at least %{count} characters long",
      tooLong: "needs to be at most %{count} characters long",
    },
  },

  email: {
    presence: { message: "is required" },
    email: { message: "is not valid" },
  },
};

module.exports = { userConstraints };
