import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId /* unique identifier*/ },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true, // prevent cross site scripting attack
    sameSite: "strict", // prevent cross site scripting attack
    secure: process.env.NODE_ENV === "development" ? false : true,
  });

  return token;
};
