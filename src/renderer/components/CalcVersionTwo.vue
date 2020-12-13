<template>
    <div>
        <b-button @click="startExpMeter">Start.</b-button>
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
export default class CalcVersiontwoComponent extends Vue {
    //~Moar Vuex.
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']

    //* Properties.
    /** Current experience overwritten by the last index of EXP_INFO_UPDATE */
    public current_experience: number = 0
    /** Calculation of the last second of exp from EXP_INFO_UPDATE */
    public last_second_calculation: number = 0
    /**Testing out an array for time gating experience data. */
    public experience_pool: Array<number> = []
    
    //* computed properties.
    get someCalculation(): number {
        return (this.maxExperienceValue - this.current_experience) / this.last_second_calculation
    }

    //* Methods
    startExpMeter() {
        ipcRenderer.send('START_NEW_EXP_METER')
    }

    //* LSH
    mounted() {
        ipcRenderer.on('EXP_INFO_UPDATE', (event, exp_data_collection: Array<IExpData>) => {
            // console.log(exp_data_collection)

            /** Calculate the last second of experience. */
            this.last_second_calculation = exp_data_collection.reduce((acc, cv) => {
                acc += cv.change_in_exp
                return acc
            }, 0)
            this.current_experience = exp_data_collection[exp_data_collection.length].current_exp


        })
    }
}
</script>

<style>
</style>
