const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const User = require("../model/user-model");
const HttpError = require("../model/http-error");
const { request } = require("express");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("could not get users", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let hasAccount;

  try {
    hasAccount = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("cold not signup user", 500);
    return next(error);
  }

  if (hasAccount) {
    const error = new HttpError("user already exist please login ", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "http://",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("cold not singup user ", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifyUser;
  try {
    identifyUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("could not login", 500);
    return next(error);
  }

  if (!identifyUser || identifyUser.password !== password) {
    const error = new HttpError("invalid email or password", 401);
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
