import { app, BrowserWindow, ipcMain, dialog } from "electron";

import waitOn from "wait-on";
import express from "express";
import getPort from "get-port";
import useragent from "express-useragent";
import { resolve } from "path";

// import ExpManager from "./tools/dps";
import ExpManager, { IExpData } from "./tools/exp"

import fs, { writeFileSync, readFileSync, existsSync } from 'fs'

let win: BrowserWindow;
let exp_manager: ExpManager | undefined = undefined

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

    ipcMain.on('FOLDER_OPEN', async () => {
        //Check for file
        //If file, continue
        //If not correct file/no file - error
        const dir = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })
        const directory = dir.filePaths[0]
        if (!existsSync(`${directory}/latest.log`)) {
            console.error('error', directory)
        } else {
            writeFileSync('./log_path.json', JSON.stringify({ log_file_path: `${directory}/latest.log` }))
        }
    })


    ipcMain.on('START_NEW_EXP_METER', () => {
        /**
         * TODO - New exp meter
         * TODO - Forward data to frontend and calc there?
         */
        /** Variable containing the currently configured file_path in the json. Problem if this does not exist, should throw an exception. */
        const file_path = JSON.parse(readFileSync('./log_path.json', {encoding: 'UTF-8'}))
        /** Simple check and consolelog to make sure that the file exists. */
        if (!existsSync(file_path.log_file_path)) {
            console.log('Issue finding the file in the config folder.')
            return
        }
        /** Create our new exp manager and store it in the upper var exp_manager */
        exp_manager = new ExpManager(file_path.log_file_path, 10000)
        /** When we recieve the EXP_COLLECTION event from the exp_manager, send the exp info to the frotnend using webContents */
        exp_manager.on('EXP_COLLECTION', (exp_data: Array<IExpData>) => {
            win.webContents.send('EXP_INFO_UPDATE', exp_data)
        })
        /** When we recieve the NO_EXP_CHANGE event from the exp_manager, send the exp info to the frotnend using webContents */
        exp_manager.on('NO_EXP_CHANGE', () => {
            win.webContents.send('NO_EXP_CHANGE')
        })
    })
});