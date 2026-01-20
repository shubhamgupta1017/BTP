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

app.whenReady().then(() => {
  startNextServer()

  // give Next.js a moment to boot
  setTimeout(createWindow, 1500)
})

app.on("window-all-closed", () => {
  if (nextProcess) nextProcess.kill()
  app.quit()
})
