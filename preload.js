// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Function to send commands to the main process (robot control commands)
  sendRobotCommand: (command) => ipcRenderer.send('robot-command', command),
  
  // Function to listen for sensor data from the main process
  onSensorData: (callback) => ipcRenderer.on('sensor-data', callback),
});

// Event listener for when the DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
  // You can optionally add more safe DOM manipulation or other code here
});
