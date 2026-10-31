const { spawn } = require('child_process');

function startTunnel() {
  console.log('[Tunnel] Starting localtunnel on port 3000...');
  const child = spawn(
    'npx',
    ['--yes', 'localtunnel', '--port', '3000', '--subdomain', 'smart-farmer-connect'],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  child.on('close', (code) => {
    console.log(`[Tunnel] Process exited with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });

  child.on('error', (err) => {
    console.error('[Tunnel] Error:', err);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
