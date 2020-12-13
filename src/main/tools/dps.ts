import { createReadStream, statSync } from 'fs'
import { parse } from 'fast-csv'
import { EventEmitter } from 'events'

export default class ExpManager extends EventEmitter {
    public filePath: string

    public firstReadSize: number
    public updateReadSize: number

    public tickrate: NodeJS.Timer
    public readFile: NodeJS.Timer

    constructor(passed_file_path: string = '') {
        super()
        this.filePath = passed_file_path
        if (!this.filePath) {
            console.log(passed_file_path, 'No file path.')
            throw new Error('Non Matching File Path.')
        }
        this.firstReadSize = statSync(this.filePath).size
        this.updateReadSize = this.firstReadSize
        console.log('File info stuff.', this.filePath, this.firstReadSize, this.updateReadSize)

        this.tickrate = setInterval(() => {
            this.dispatch('PER_MINUTE', '')
        }, 60000)
        this.readFile = setInterval(() => {
            const byteDiff = statSync(this.filePath).size - this.updateReadSize
            if (byteDiff > 0) {
                const here_we_go = createReadStream(this.filePath, { autoClose: true, start: this.updateReadSize })
                    .pipe(parse({ headers: false, delimiter: '\n' }))
                    .on('error', error => console.error(error))
                    .on('data', row => {
                        const data_row = row[0]
                        if (!data_row.includes('EXP: ')) {
                            return
                        }
                        const calcData: number = parseInt(data_row.split(': EXP: �2+')[1].split('XP (')[0])
                        this.dispatch('EXP', calcData)
                    })
                    .on('end', rc => {
                        here_we_go.destroy()
                    })
            }
            this.updateReadSize += byteDiff
        }, 1000)
    }
    dispatch(event: string, data: any) {
        this.emit(event, data)
    }
}