const $ = id => document.getElementById(id);
const defaults = {name:'YOUR SMP', host:'play.example.net', port:25565};
let server;
try { server = {...defaults, ...JSON.parse(localStorage.getItem('monarch.server') || '{}')}; }
catch { server = {...defaults}; }

function notice(message) {
  const el = $('notice');
  if (el) el.textContent = message;
}
function address() {
  return `${server.host}${Number(server.port) === 25565 ? '' : ':' + server.port}`;
}
function paintServer() {
  $('serverName').textContent = server.name;
  $('serverAddress').textContent = address();
  $('homeAddress').textContent = address();
  $('serverNameInput').value = server.name;
  $('hostInput').value = server.host;
  $('portInput').value = server.port;
}
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === name));
  document.querySelectorAll('.nav').forEach(b => b.classList.toggle('active', b.dataset.page === name));
  $('crumb').textContent = 'MONARCH / ' + name.toUpperCase();
}
document.querySelectorAll('.nav').forEach(button =>
  button.addEventListener('click', () => showPage(button.dataset.page))
);

async function checkServer() {
  $('statusText').textContent = 'Checking connection…';
  $('pulse').classList.remove('online');
  try {
    const result = await window.launcherAPI.checkServer(server.host, Number(server.port));
    $('statusText').textContent = result.online ? 'Server reachable' : result.message;
    $('pulse').classList.toggle('online', result.online);
  } catch {
    $('statusText').textContent = 'Could not check server';
  }
}
$('saveServer').addEventListener('click', () => {
  const name = $('serverNameInput').value.trim();
  const host = $('hostInput').value.trim();
  const port = Number($('portInput').value);
  if (!name || !/^[a-zA-Z0-9.-]+$/.test(host) || host.length > 253 ||
      !Number.isInteger(port) || port < 1 || port > 65535) {
    notice('Enter a valid server name, hostname and port.');
    return;
  }
  server = {name, host, port};
  localStorage.setItem('monarch.server', JSON.stringify(server));
  paintServer();
  notice('Server settings saved on this device.');
  checkServer();
});
$('checkServer').addEventListener('click', checkServer);
$('copyButton').addEventListener('click', async () => {
  try {
    await window.launcherAPI.copyServer(address());
    notice('Copied server address: ' + address());
  } catch { notice('Could not copy the server address.'); }
});
$('playButton').addEventListener('click', () => {
  notice('This build cannot launch Minecraft directly yet. Open your installed, compatible Minecraft launcher and connect to ' + address() + '.');
});
$('saveName').addEventListener('click', () => {
  const name = $('username').value.trim();
  if (!/^[A-Za-z0-9_]{1,16}$/.test(name)) {
    notice('Use 1–16 letters, numbers or underscores.');
    return;
  }
  localStorage.setItem('monarch.username', name);
  $('homeUser').textContent = name;
  notice('Local display identity saved: ' + name);
});
$('saveSettings').addEventListener('click', () => {
  localStorage.setItem('monarch.settings', JSON.stringify({
    resolution: $('resolution').value,
    reducedMotion: $('reducedMotion').checked
  }));
  document.body.classList.toggle('reduced-motion', $('reducedMotion').checked);
  notice('Interface preferences saved.');
});
$('downloadButton').addEventListener('click', () => window.launcherAPI.openDownloadPage());

try {
  const username = localStorage.getItem('monarch.username') || 'ShadowPlayer';
  $('username').value = username;
  $('homeUser').textContent = username;
  const settings = JSON.parse(localStorage.getItem('monarch.settings') || '{}');
  $('resolution').value = settings.resolution || 'normal';
  $('reducedMotion').checked = Boolean(settings.reducedMotion);
  document.body.classList.toggle('reduced-motion', Boolean(settings.reducedMotion));
} catch {}
paintServer();
checkServer();
