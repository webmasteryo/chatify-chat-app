import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordRegx =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegx.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 6 characters long and have atleast 1 Uppercase letter, 1 lowercase letter, 1 special symbol and 1 number",
      });
    }

    // check if emails valid: regex

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?).)+[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
    }

    //check if email already exists for that we will build a model and then find from it

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "email already exists" });
    }

    // now we dont want to store the password as it is we need tot encrypt it and then store in our database so for that we will use bcypt library

    const salt = await bcrypt.genSalt(10); // this is the encypting algo we are using. 10 tells how long we want the string longer the string the more secure but longer it is the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      // profilePic:
      //   profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res); // for authenticating the user
      res.status(201).json({
        message: "user created successfully",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    // never tell the client which is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user._id, res);
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("error in login controller");
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const logout = (/* no need for request req*/ _, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged Out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "profile pic required" });

    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({ updatedUser, message: "profile pic updated" });
  } catch (error) {
    console.log("errorin profile pic updation", error);
    res
      .status(500)
      .json({ message: "Internal servber error", error: error.message });
  }
};
