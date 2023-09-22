const { cookieProduction, serverPort } = require("../secret");

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
    secure: true,
    // domain: "task-management-system-flax.vercel.app",
    // SameSite: "Strict",
    // domain:
    //   cookieProduction === "production"
    //     ? "task-management-system-flax.vercel.app"
    //       "task-management-system-eg5a.vercel.app"
    //     : `localhost:${serverPort}`,
    domain: ".vercel.app",
    sameSite: "none",
    path: "/",
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,
    // domain: "task-management-system-flax.vercel.app",
    // SameSite: "Strict",
    // domain:
    //   cookieProduction === "production"
    //      ? "task-management-system-flax.vercel.app"
    //       "task-management-system-eg5a.vercel.app"
    //     : `localhost:${serverPort}`,
    domain: ".vercel.app",
    sameSite: "none",
    path: "/",
  });
};
module.exports = { setAccessTokenCookie, setRefreshTokenCookie };
