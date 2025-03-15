const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = { requestLogger };