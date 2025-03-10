const { app, BrowserWindow } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let ws;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')  // Ensure the preload.js path is correct
    }
  });

  // Load the index.html file into the window
  mainWindow.loadFile('index.html');  // Ensure this points to the correct HTML file

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();

  // Emit closed event when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// WebSocket setup function
function setupWebSocket() {
  // Replace with your Raspberry Pi's IP address
  ws = new WebSocket('ws://192.168.4.186:8765'); // Ensure this IP matches the server

  ws.on('open', function open() {
    console.log('WebSocket connected');
  });

  ws.on('message', function incoming(data) {
    console.log('Message from WebSocket server:', data);
    try {
      const sensorData = JSON.parse(data);
      if (mainWindow) {
        mainWindow.webContents.send('sensor-data', sensorData); // Send data to renderer
      }
    } catch (e) {
      console.error('Error parsing sensor data:', e);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    // Automatically attempt to reconnect if closed unexpectedly
    setTimeout(setupWebSocket, 1000); // Reconnect after 1 second
  });
}

// When Electron is ready, create the window
app.whenReady().then(() => {
  createWindow();
  setupWebSocket();  // Set up WebSocket connection after the window is created
});

// Quit the application when all windows are closed (on macOS, it’s common for apps to stay open)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Recreate the window if the app is reactivated (macOS specific)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
