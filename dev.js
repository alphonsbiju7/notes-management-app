const { spawn } = require('child_process');
const path = require('path');

function runService(name, dir, command, args) {
  console.log(`[${name}] Starting...`);
  const proc = spawn(command, args, {
    cwd: path.join(__dirname, dir),
    shell: true,
    stdio: 'inherit'
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Exited with code ${code}`);
  });

  return proc;
}

runService('Backend', 'backend', 'npm', ['run', 'dev']);
runService('Frontend', 'frontend', 'npm', ['run', 'dev']);
