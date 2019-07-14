
exports.isNullOrWhitespace = function(string) {
  const whitespace = /\s{0,}/;
  return string == null || whitespace.test(string);
}