const mongoose = require("mongoose");
main().catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect("mongodb://localhost:27017/test");
  console.log("connected");
  const userSchema = new mongoose.Schema({
    name: String,
  });

  const user = mongoose.model("user", userSchema);

  const zainab = new user({ name: "zainab" });

  const shaikh = new user({ name: "shaikh" });

  zainab.save();
  shaikh.save();
  const username = await user.find();

  console.log(username);
}
