# Shadow SMP Launcher (Windows)

A starter Electron desktop launcher shell for a Minecraft Java SMP. Includes a custom dark-purple interface, TCP reachability check, copy-IP button, and a button that requests opening the official Minecraft Launcher.

## Build from an Android phone using GitHub Actions
1. Install Termux from its official F-Droid/GitHub distribution.
2. Download and extract this project ZIP to your phone's Download folder.
3. In Termux run `pkg update && pkg install git nodejs unzip gh` and `termux-setup-storage`.
4. Change into the extracted project folder, then run `git init -b main`, `git add .`, `git commit -m "Initial launcher project"`.
5. Run `gh auth login` and follow the browser login prompts.
6. Run `gh repo create shadow-smp-launcher --public --source=. --remote=origin --push` (if the repo name already exists, choose another name).
7. On GitHub open the repository's **Actions** tab. Wait for **Build Windows Launcher** to finish successfully.
8. Open that workflow run, scroll to **Artifacts**, and download `Shadow-SMP-Launcher-Windows-Installer`. Extract the downloaded artifact ZIP to get the `.exe` installer.

## Configure your server
Edit `renderer.js` and update the `SERVER` values to your SMP's actual name, host, and port before committing/pushing changes.

## Local Windows build
Install Node.js LTS, open PowerShell in this folder, then run `npm install`, `npm start`, or `npm run dist`.

## Limits and account safety
This starter does not download/install Minecraft, implement Microsoft authentication, or directly launch a game process. The display name is only a UI preview, not an authenticated Minecraft account. The Play button requests opening the official Minecraft Launcher. Use legitimate account authentication for online multiplayer. Only use server-side offline mode on a private test server you control. Never put GitHub passwords or personal access tokens in source files.

Unofficial community project; not affiliated with Mojang or Microsoft.
