const server = require('./api/server.js');

const PORT = process.env.PORT || 3300;
if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`\n=> Server up at http://localhost:${PORT}\n`)
  })
}
