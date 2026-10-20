// Change these three values to your SMP's real details.
const SERVER = {
  name: 'YOUR SMP',
  host: 'play.example.net',
  port: 25565
};

const $ = (id) => document.getElementById(id);
const address = `${SERVER.host}${SERVER.port === 25565 ? '' : ':' + SERVER.port}`;

$('serverName').textContent = SERVER.name;
$('serverAddress').textContent = address;
$('serverAddress2').textContent = address;

function showNotice(message) {
  $('notice').textContent = message;
}

async function refreshServerStatus() {
  $('statusText').textContent = 'Checking server…';
  $('pulse').classList.remove('online');
  const result = await window.launcherAPI.checkServer(SERVER.host, SERVER.port);
  $('statusText').textContent = result.online ? 'Server reachable' : result.message;
  $('pulse').classList.toggle('online', result.online);
}

$('playButton').addEventListener('click', async () => {
  showNotice('Opening Minecraft…');
  const result = await window.launcherAPI.openMinecraft();
  showNotice(result.message + ' Then choose the matching version and connect to ' + address + '.');
});

$('copyButton').addEventListener('click', async () => {
  await window.launcherAPI.copyServer(address);
  $('copyButton').textContent = 'COPIED ✓';
  showNotice('Server address copied: ' + address);
  setTimeout(() => { $('copyButton').textContent = 'COPY SERVER IP'; }, 1800);
});

$('saveName').addEventListener('click', () => {
  const name = $('username').value.trim();
  if (!name) {
    showNotice('Enter a display name first.');
    return;
  }
  if (!/^[A-Za-z0-9_]{1,16}$/.test(name)) {
    showNotice('Use 1–16 letters, numbers, or underscores.');
    return;
  }
  showNotice('Display name preview saved for this session: ' + name + '. This is not account authentication.');
});

$('downloadButton').addEventListener('click', () => {
  window.launcherAPI.openDownloadPage();
});

refreshServerStatus();
setInterval(refreshServerStatus, 30000);
