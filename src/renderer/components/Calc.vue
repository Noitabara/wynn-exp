<template>
    <div>
        <b-button @click="startExpMeter">Start.</b-button>
        <b-progress :max="60" height="2rem" id="bar">
            <b-progress-bar :value="minute_has_passed_counter" variant="secondary">
                <span id="p_bar_text">Time til log {{ minute_has_passed_counter }}</span>
            </b-progress-bar>
        </b-progress>
        <!-- <p>{{ experience_pool.length >= 5 ? `EXP/5s: ${fiveSecondReport}` : `Not enough data to calculate 5/s yet.` }} </p> -->
        <!-- <p>{{ experience_pool.length >= 10 ? `EXP/10s: ${tenSecondReport}` : `Not enough data to calculate 10/s yet.` }} </p> -->
        <!-- <p>{{ experience_pool.length >= 30 ? `EXP/30s: ${thirtySecondReport}` : `Not enough data to calculate 30/s yet.` }} </p> -->
        <p>{{ experience_pool.length >= 60 ? `EXP/60s: ${sixtySecondReport}` : `Not enough data to calculate 60/s yet.` }} </p>
        <p>Predicted MTL: {{ Math.floor((maxExperienceValue - current_experience) / sixtySecondReport) }}/min til level.</p>
        <!-- <p>{{ experience_pool }}</p> -->
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { namespace } from "nuxt-class-component";
//~ Vuex.
import { namespace as settingStoreNamespace, IMasterState, actionType } from '~/store/welp'
import { ipcRenderer } from "electron";
import { IExpData } from "src/main/tools/exp";
const SettingStore = namespace(settingStoreNamespace)

@Component({})
export default class Calc extends Vue {
    //~Moar Vuex.
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']
    @SettingStore.Action(actionType.ADD_EXP_TO_EXPM_LOG) addExpToEXPMLog!: (exp: number) => void

    //* Properties.
    /** Current experience overwritten by the last index of EXP_INFO_UPDATE */
    public current_experience: number = 0
    /** Calculation of the last second of exp from EXP_INFO_UPDATE */
    public last_second_calculation: number = 0
    /** Testing out an array for time gating experience data. */
    public experience_pool: Array<number> = []

    /** A counter which is intended to loop every 60 ticks(60 seconds) */
    public minute_has_passed_counter: number = 0

    //* computed properties.
    /** Last 5 of the 60 second report. */
    get fiveSecondReport(): number {
        // return this.experience_pool.slice(this.experience_pool.length - 5)
        return this.experience_pool.slice(this.experience_pool.length - 5).reduce((acc, cv) => {
            acc += cv
            return acc
        }, 0)
    }
    /** Last 10 of the 60 second report. */
    get tenSecondReport(): number {
        // return this.experience_pool.slice(this.experience_pool.length - 5)
        return this.experience_pool.slice(this.experience_pool.length - 10).reduce((acc, cv) => {
            acc += cv
            return acc
        }, 0)
    }
    /** Last 30 of the 60 second report */
    get thirtySecondReport(): number {
        // return this.experience_pool.slice(this.experience_pool.length - 5)
        return this.experience_pool.slice(this.experience_pool.length - 30).reduce((acc, cv) => {
            acc += cv
            return acc
        }, 0)
    }
    /** all 60 entries from the backend. */
    get sixtySecondReport(): number {
        // return this.experience_pool.slice(this.experience_pool.length - 5)
        return this.experience_pool.reduce((acc, cv) => {
            acc += cv
            return acc
        }, 0)
    }
    
    //* Methods
    startExpMeter() {
        ipcRenderer.send('START_NEW_EXP_METER')
    }

    //* LSH
    mounted() {
        /** This event handler is invovled with handling what happens when exp is gained. */
        ipcRenderer.on('EXP_INFO_UPDATE', (event, exp_data_collection: Array<IExpData>) => {

            /** Calculate the last second of experience. */
            this.last_second_calculation = exp_data_collection.reduce((acc, cv) => {
                acc += cv.change_in_exp
                return acc
            }, 0)

            this.current_experience = exp_data_collection[exp_data_collection.length - 1].current_exp

            this.experience_pool.push(this.last_second_calculation)
            if (this.experience_pool.length > 60) {
                this.experience_pool.shift()
            }
            this.minute_has_passed_counter++
            if (this.minute_has_passed_counter >= 60) {
                this.minute_has_passed_counter = 0
                this.addExpToEXPMLog(this.sixtySecondReport)
            }
        })
        /** This event handler is involved with handling what happens when no exp is gained. */
        ipcRenderer.on('NO_EXP_CHANGE', () => {
            /** Calculate the last second of experience. */
            this.last_second_calculation = 0

            this.experience_pool.push(this.last_second_calculation)
            if (this.experience_pool.length > 60) {
                this.experience_pool.shift()
            }
            this.minute_has_passed_counter++
            if (this.minute_has_passed_counter >= 60) {
                this.minute_has_passed_counter = 0
                this.addExpToEXPMLog(this.sixtySecondReport)
            }
        })
    }
}
</script>

<style>
#p_bar_text {
    color: black;
    font-size: 20px;
    font-weight: bold;
}
#bar {
    margin-top: 1em;
    margin-bottom: 1em;
}
</style>
