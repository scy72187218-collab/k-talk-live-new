module.exports = function handler(req, res) {
  var stage = String((req.query && req.query.stage) || 'unknown').slice(0,80);
  var detail = String((req.query && req.query.detail) || '').slice(0,180);
  console.log('[kt-live-debug]', stage, detail);
  res.status(204).end();
};