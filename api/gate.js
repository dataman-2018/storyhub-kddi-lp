module.exports = (req, res) => {
  const USERS = { storyhub: "ensemble" };
  const cookie = (req.headers.cookie || "").split(";").map(c => c.trim());
  if (cookie.find(c => c.startsWith("sh_auth="))) {
    res.writeHead(302, { Location: "/" });
    return res.end();
  }
  const auth = req.headers.authorization;
  if (auth) {
    const [user, pass] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
    if (USERS[user] === pass) {
      const expires = new Date(Date.now() + 86400000).toUTCString();
      res.writeHead(302, {
        Location: "/",
        "Set-Cookie": `sh_auth=1; Path=/; HttpOnly; Expires=${expires}`,
      });
      return res.end();
    }
  }
  res.writeHead(401, { "WWW-Authenticate": 'Basic realm="StoryHub"' });
  res.end("Unauthorized");
};
