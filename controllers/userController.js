module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({ user: username, status: "success" });
};

module.exports.getPosts = async (req, res) => {
  res.send("posts");
};
module.exports.getPostsById = async (req, res) => {
  res.send("i am from posts ");
};
module.exports.getPostsByCategory = async (req, res) => {
  res.send("i am from this category");
};

module.exports.getWatchingHistory = async (req, res) => {
  res.send("user history");
};
module.exports.getAuther = async (req, res) => {
  res.send("Auther");
};
