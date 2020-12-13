import { app, BrowserWindow, ipcMain, dialog } from "electron";

import waitOn from "wait-on";
import express from "express";
import getPort from "get-port";
import useragent from "express-useragent";
import { resolve } from "path";

import ExpManager from "./tools/dps";

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
            writeFileSync('./path.json', JSON.stringify({ log_file_path: `${directory}/latest.log` }))
        }
    })
    ipcMain.on('START', () => {
        let file_path = JSON.parse(readFileSync('./path.json', { encoding: 'UTF-8'}))
        //Check for file here
        if (!existsSync(file_path)) {
            return
        }
        exp_manager = new ExpManager(file_path)
    })


    let exp_array: Array<number> = []
    
    let total_exp_since_last_count: number = 0
    let iterations: number = 0
    
    let current_character_exp: number = 0
    ipcMain.on('SET_CUR_EXP', (event, new_EXP: number) => { current_character_exp = new_EXP })
    // let required_exp_to_level: number = 0
    // ipcMain.on('SET_REQ_EXP', (event, new_EXP: number) => { required_exp_to_level = new_EXP })

    exp_manager.on('EXP', (exp_amount: number) => {
        // Should probably move this calculation to a new class/the manager class.
        total_exp_since_last_count += exp_amount
    })
    exp_manager.on('MINUTE_PASS', () => {
        // Send the new data to the frontend
        current_character_exp += total_exp_since_last_count
        exp_array.push(total_exp_since_last_count)
        const exp_on_avg: number = Math.floor(
            exp_array.reduce((acc, cv) => {
                acc += cv
                return acc
            }, 0)/exp_array.length
        )
        iterations++
        console.log(total_exp_since_last_count, exp_on_avg, iterations)
        win.webContents.send('EXP_UPDATE', { EXP_LAST_MIN: total_exp_since_last_count, EXP_ON_AVG: exp_on_avg })
        total_exp_since_last_count = 0
    })
});