module.exports = function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.end(JSON.stringify({ ok: true, time: Date.now() }));
};
