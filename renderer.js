// renderer.js

// WebSocket client connection setup
const socket = new WebSocket('ws://192.168.4.186:8765');  // Replace with the actual Raspberry Pi IP

// Function to handle WebSocket connection opened
socket.onopen = () => {
  console.log('Connected to the Raspberry Pi WebSocket server');
};

// Function to handle WebSocket message received (responses from the server)
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received data:', data);

  if (data.sensor_data) {
    // Update UI with sensor data
    document.getElementById('distance').innerText = data.sensor_data.distance || '0.0';
  }

  if (data.status) {
    console.log('Status:', data.status);
  }
  
  // Re-enable buttons after the data is received
  enableButtons();
};

// Function to handle WebSocket error
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
  alert('Error connecting to the Raspberry Pi');
};

// Function to handle WebSocket connection closure
socket.onclose = () => {
  console.log('Disconnected from WebSocket server');
  alert('Disconnected from the Raspberry Pi');
};

// Disable all buttons
function disableButtons() {
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  document.querySelectorAll('span').forEach(span => span.style.color = 'blue');
}

// Enable all buttons
function enableButtons() {
  document.querySelectorAll('button').forEach(button => button.disabled = false);
  document.querySelectorAll('span').forEach(span => span.style.color = 'grey');
}

// Function to send command to the backend via WebSocket
function sendCommandToRobot(command) {
  disableButtons();  // Disable buttons to indicate that the command is being processed

  const message = { action: command };
  socket.send(JSON.stringify(message));  // Send the command to the Raspberry Pi via WebSocket
}

// Event handlers for each direction and action
function moveForward() {
  sendCommandToRobot('MOVE_FORWARD');
}

function moveBackward() {
  sendCommandToRobot('MOVE_BACKWARD');
}

function moveLeft() {
  sendCommandToRobot('TURN_LEFT');
}

function moveRight() {
  sendCommandToRobot('TURN_RIGHT');
}

function sendMessage() {
  const message = document.getElementById('message').value;
  console.log(`Message to Pi: ${message}`);
  sendCommandToRobot(message);
}

// Event handler for "Stop" button
document.getElementById('stopButton').addEventListener('click', function () {
  sendCommandToRobot('STOP');  // Ensure STOP is sent every time
});

// Event handler for "Get Sensor Data" button
document.getElementById('getSensorDataButton').addEventListener('click', function () {
  sendCommandToRobot('GET_SERVER_DATA');
});

// Listen for sensor data from the Raspberry Pi and update UI
// You can extend this to handle other sensor data or states
function updateUI(data) {
  document.getElementById('direction').innerText = data.direction || 'Unknown';
  document.getElementById('speed').innerText = data.speed || '0.0';
  document.getElementById('distance').innerText = data.distance || '0.0';
  document.getElementById('temperature').innerText = data.temperature || '0.0';
  document.getElementById('bluetooth').innerText = data.bluetooth || 'Disconnected';
}
