const { fork } = require("child_process")
const path = require("path")

function startNextServer() {
  const serverPath = path.join(
    __dirname,
    "../.next/standalone/server.js"
  )

  fork(serverPath, [], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
    },
    stdio: "inherit",
  })
}

module.exports = { startNextServer }
