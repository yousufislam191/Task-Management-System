const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 60 * 60 * 1000, // 60 minutes
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
};
module.exports = { setAccessTokenCookie, setRefreshTokenCookie };
