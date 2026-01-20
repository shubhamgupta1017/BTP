const { app, BrowserWindow } = require("electron")
const path = require("path")
const { fork } = require("child_process")

let mainWindow
let nextProcess

function startNextServer() {
  const serverPath = path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    ".next",
    "standalone",
    "server.js"
  )

  nextProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
    },
    stdio: "inherit",
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  })

  mainWindow.loadURL("http://localhost:3000")
}

const net = require("net")

function waitForServer(port, cb) {
  const socket = new net.Socket()
  socket.setTimeout(1000)

  socket.on("connect", () => {
    socket.destroy()
    cb()
  })

  socket.on("error", () => setTimeout(() => waitForServer(port, cb), 500))
  socket.on("timeout", () => setTimeout(() => waitForServer(port, cb), 500))

  socket.connect(port, "127.0.0.1")
}

app.whenReady().then(() => {
  startNextServer()
  waitForServer(3000, createWindow)
})


app.on("window-all-closed", () => {
  if (nextProcess) nextProcess.kill()
  app.quit()
})
