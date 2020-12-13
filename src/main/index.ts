import { app, BrowserWindow, ipcMain, dialog } from "electron";

import waitOn from "wait-on";
import express from "express";
import getPort from "get-port";
import useragent from "express-useragent";
import { resolve } from "path";

import ExpManager from "./tools/dps";

import fs, { writeFileSync, readFileSync, existsSync } from 'fs'

writeFileSync('./path.json', JSON.stringify(''))

const my_exp = new ExpManager(`C:\\Users\\harry\\Documents\\MultiMC\\instances\\Wynntils\\.minecraft\\logs\\latest.log`)
my_exp.on('EXP', (returnedData) => {
    console.log(returnedData)
})

let win: BrowserWindow;
let exp_manager: ExpManager

function loadContent(port = 3000) {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL(`http://localhost:${port}`);
}

app.on("ready", async () => {
    if (process.env.NODE_ENV === "development") {
        // Importing dev dependencies
        const devtools = await import("electron-devtools-installer");

        // Installing devtools
        await devtools.default(devtools.VUEJS_DEVTOOLS);

        // Waiting for web server
        waitOn({ resources: [`http://localhost:3000`] }, loadContent);
    } else {
        const server = express();
        server.use(useragent.express());

        // Rejecting requests from browsers
        server.use((req, res, next) => {
            if (req.useragent.source.includes("Electron")) next();
            else res.end();
        });

        server.use(express.static(resolve(__dirname, "../renderer")));

        const port = await getPort();
        server.listen(port, "localhost", () => loadContent(port));
    }
    ipcMain.on('FOLDER_OPEN', () => {
        //Check for file
        //If file, continue
        //If not correct file/no file - error
        let dir: string
        dir = dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })[0]
        if (!existsSync(`${dir}/latest.log`)) {
            console.error('error')
        } else {
            writeFileSync('./path.json', { log_file_path: `${dir}/latest.log` })
        }
        // exp_manager = new ExpManager(`${dir}/latest.log`)
    })
    ipcMain.on('START', () => {
        if (!exp_manager) {
            return
        }
        //Check for file here
    })
    win.webContents.once('dom-ready', () => {
        win.webContents.send('')
    })
});
