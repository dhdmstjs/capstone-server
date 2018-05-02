var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ImgSchema = new Schema({
  public_id: String,
  signature: String,
  width: String,
  height: String,
  format: String,
  resource_type: String,
  created_at: String,
  tags: Array,
  bytes: String,
  type: String,
  etag: String,
  placeholder: Boolean,
  url: String,
  secure_url: String,
  original_filename: String,
  sid: String

});

var Img = mongoose.model("Img", ImgSchema);
module.exports = Img;
