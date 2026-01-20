const { app, BrowserWindow } = require("electron")
const path = require("path")
const { spawn } = require("child_process")

let mainWindow
let nextProcess

function startNextServer() {
  const serverPath = path.join(
    __dirname,
    "../.next/standalone/server.js"
  )

  nextProcess = spawn("node", [serverPath], {
    cwd: path.join(__dirname, "../.next/standalone"),
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
  createWindow()
})

app.on("window-all-closed", () => {
  if (nextProcess) nextProcess.kill()
  app.quit()
})
