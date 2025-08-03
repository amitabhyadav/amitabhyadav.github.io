const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// Start the Express server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Express server...');
    
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' }
    });

    let serverStarted = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server:', output);
      if (output.includes('Blog Editor Server running') && !serverStarted) {
        serverStarted = true;
        console.log('Server confirmed started, resolving...');
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('Server Error:', error);
      
      // Check for common errors
      if (error.includes('EADDRINUSE')) {
        console.error('Port 3000 is already in use!');
        if (!serverStarted) {
          reject(new Error('Port 3000 is already in use. Please close other instances.'));
        }
      }
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      if (code !== 0 && !serverStarted) {
        reject(new Error(`Server failed to start (exit code: ${code})`));
      }
      
      // If server exits after starting, try to restart it
      if (serverStarted && mainWindow && !mainWindow.isDestroyed()) {
        console.log('Server unexpectedly closed, attempting restart...');
        setTimeout(() => {
          startServer().catch(console.error);
        }, 2000);
      }
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server process:', error);
      if (!serverStarted) {
        reject(error);
      }
    });

    // Fallback timeout
    setTimeout(() => {
      if (!serverStarted) {
        console.log('Server start timeout, assuming it started...');
        resolve();
      }
    }, 5000);
  });
}

// Stop the Express server
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// Create the application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Optional: add an icon
    title: 'Blog Editor',
    show: false // Don't show until ready
  });

  // Load the local server
  mainWindow.loadURL('http://localhost:3000');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    stopServer();
    app.quit();
  });

  // Optional: Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

// Handle Linux sandbox issues
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('--no-sandbox');
  app.commandLine.appendSwitch('--disable-dev-shm-usage');
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('--disable-software-rasterizer');
}

// App event handlers
app.whenReady().then(async () => {
  try {
    console.log('Starting Blog Editor...');
    await startServer();
    console.log('Server started, creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopServer();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app quit
app.on('before-quit', () => {
  stopServer();
});

// Handle unexpected errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  stopServer();
  app.quit();
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});