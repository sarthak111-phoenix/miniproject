const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');

// Helper to kill any stale process occupying a port (Windows and Unix)
function freePort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== String(process.pid)) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`[setup] Freed port ${port} (terminated PID ${pid})`);
        } catch (_) {}
      }
    } else {
      execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
    }
  } catch (_) {
    // Port is free or command not applicable
  }
}

console.log('\x1b[36m%s\x1b[0m', '🔍 Checking ports 3000 and 4000...');
freePort(3000);
freePort(4000);

const rootDir = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('\n\x1b[32m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '   🚀 SAARTHI AI — STARTING DEVELOPMENT SERVERS');
console.log('\x1b[32m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[35m%s\x1b[0m', '   👉 Web Frontend:  http://localhost:3000');
console.log('\x1b[34m%s\x1b[0m', '   👉 Backend API:   http://localhost:4000');
console.log('\x1b[32m%s\x1b[0m', '════════════════════════════════════════════════════════════════\n');

// Prefix stream helper
function pipePrefixed(stream, prefix, color) {
  let buffer = '';
  stream.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}${prefix}\x1b[0m ${line}`);
      }
    }
  });
  stream.on('end', () => {
    if (buffer.trim()) {
      console.log(`${color}${prefix}\x1b[0m ${buffer}`);
    }
  });
}

let isShuttingDown = false;
let backendProcess = null;

function startBackend() {
  if (isShuttingDown) return;
  freePort(4000);
  backendProcess = isWin
    ? spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '-w', '@saarthi/backend'], { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } })
    : spawn('npm', ['run', 'dev', '-w', '@saarthi/backend'], { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } });

  pipePrefixed(backendProcess.stdout, '[backend]', '\x1b[34m');
  pipePrefixed(backendProcess.stderr, '[backend:err]', '\x1b[31m');

  backendProcess.on('close', (code) => {
    if (!isShuttingDown) {
      console.log('\x1b[33m%s\x1b[0m', `[backend exited with code ${code}, restarting in 1s...]`);
      setTimeout(startBackend, 1000);
    }
  });
}

startBackend();

// Spawn Web Frontend
const web = isWin
  ? spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '-w', '@saarthi/web'], { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } })
  : spawn('npm', ['run', 'dev', '-w', '@saarthi/web'], { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } });

pipePrefixed(web.stdout, '[web]', '\x1b[32m');
pipePrefixed(web.stderr, '[web:err]', '\x1b[33m');

function cleanup() {
  isShuttingDown = true;
  console.log('\n\x1b[31m%s\x1b[0m', '🛑 Shutting down servers...');
  try {
    if (isWin) {
      if (backendProcess && backendProcess.pid) execSync(`taskkill /F /T /PID ${backendProcess.pid}`, { stdio: 'ignore' });
      if (web.pid) execSync(`taskkill /F /T /PID ${web.pid}`, { stdio: 'ignore' });
    } else {
      if (backendProcess) backendProcess.kill('SIGTERM');
      if (web.pid) web.kill('SIGTERM');
    }
  } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

web.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[web exited with code ${code}]\x1b[0m`);
  }
});

