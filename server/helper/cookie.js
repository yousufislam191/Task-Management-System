const { cookieProduction } = require("../secret");

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
    secure: cookieProduction === "production",
    sameSite: "none",
    path: "/",
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: cookieProduction === "production",
    sameSite: "none",
    path: "/",
  });
};
module.exports = { setAccessTokenCookie, setRefreshTokenCookie };
