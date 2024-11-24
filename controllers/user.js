import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/features.js";
import bcrypt from "bcrypt";
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email or Password", 404));

    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exist", 400));
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = await User.create({ name, email, password: hashedPassword });
    sendCookie(user, res, "Resgister Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
      secure: process.env.NODE_ENV === "DEVEOPMENT" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};
