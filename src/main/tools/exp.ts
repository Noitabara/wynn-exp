import { createReadStream, statSync } from 'fs'
import { parse } from 'fast-csv'
import { EventEmitter } from 'events'

export default class ExpManager extends EventEmitter {
    public filePath: string

    public firstReadSize: number
    public updateReadSize: number

    public tickrate: NodeJS.Timer
    public readFile: NodeJS.Timer

    public tickrateInterval: number
    /**
     * 
     * @param passed_file_path The path that the file we want to read resides in.
     * @param tickrate_interval The tickrate to configure the tickrate_passed event to.
     */
    constructor(passed_file_path: string = '', tickrate_interval: number) {
        super()

        console.log('setting up exp.')
        
        this.filePath = passed_file_path
        this.tickrateInterval = tickrate_interval

        if (!this.filePath) {
            console.log(passed_file_path, 'No file path.')
            throw new Error('Non Matching File Path.')
        }

        this.firstReadSize = statSync(this.filePath).size
        this.updateReadSize = this.firstReadSize
        
        console.log('File info stuff.', this.filePath, this.firstReadSize, this.updateReadSize)
        
        this.tickrate = setInterval(() => {
            this.dispatch('TICKRATE_PASSED', '')
        }, this.tickrateInterval)

        this.readFile = setInterval(() => {
            const byteDiff = statSync(this.filePath).size - this.updateReadSize
            if (byteDiff > 0) {
                const here_we_go = createReadStream(this.filePath, { autoClose: true, start: this.updateReadSize })
                    .pipe(parse({ headers: false, delimiter: '\n' }))
                    .on('error', error => console.error(error))
                    .on('data', row => {
                        const data_row = row[0]
                        if (!data_row.includes('EXP:_')) {
                            return
                        }
                        // const calcData: number = parseInt(data_row.split(': EXP: �2+')[1].split('XP (')[0])
                        const [old_exp_amnt, current_exp_amnt, change_in_exp_amnt] = data_row.split('EXP:_')[1].split('_')
                        const exp_data: IExpData = {
                            old_amount: old_exp_amnt,
                            current_exp: current_exp_amnt,
                            change_in_exp: change_in_exp_amnt
                        }
                        console.log(exp_data)
                        this.dispatch('EXP', exp_data)
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

export interface IExpData {
    /** Exp before the current change. */
    old_amount: number,
    /** Exp after the current change. */
    current_exp: number,
    /** How much the exp changed by. */
    change_in_exp: number
}