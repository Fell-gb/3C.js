const {
	app,
	BrowserWindow,
	globalShortcut,
	Menu,
	ipcMain,
	Tray
} = require('electron');
const path = require("path");

// if (require('electron-squirrel-startup')) {
// 	app.quit();
// }

let mainWindow;
// let mainWindow = new BrowserWindow();

let appIcon = null;

const createWindow = () => {

	mainWindow = new BrowserWindow({
		width: 800,
		height: 580,
		frame: false,
		transparent: true,
		// icon: __dirname+ "\\assets\\img\\icons\\electron.ico",
		titleBarStyle: "customButtonsOnHover",
		webPreferences: {
			allowRunningInsecureContent: true,
			javascript: true,
			nodeIntegration: true,
			nodeIntegrationInSubFrames: true,
			nodeIntegrationInWorker: true,
			webSecurity: false
		}
	});
	// mainWindow.setSize(cfg.width,cfg,height,true);
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible());
	mainWindow.center();
	mainWindow.setIcon(__dirname + "\\lib\\img\\electron.ico");
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};


app.on('ready', () => {
	createWindow();
	globalShortcut.register("shift+R", () => {
		app.relaunch();
		app.quit();
	});
	globalShortcut.register("Shift+Alt+X", () => {
		mainWindow.webContents.toggleDevTools();
	});
	globalShortcut.register("shift+Alt+V", () => {
		mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible());
	});
	globalShortcut.register("shift+Alt+.", () => {

	});

});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
	if (appIcon) appIcon.destroy();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();

	}
});

ipcMain.on('put-in-tray', (event) => {

	const iconName = "lib/img/electron.ico";
	const iconPath = path.join(__dirname, iconName);
	appIcon = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate([{
			label: "quit",
			click: () => {
				app.quit();
			}
		},
		{
			label: "Reload",
			click: () => {

				app.relaunch();
				app.quit();
			}
		}
	]);

	appIcon.setContextMenu(contextMenu);
});
ipcMain.on("remove-tray", () => {
	appIcon.destroy();
});
