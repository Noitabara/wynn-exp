<template>
    <div>
        <b-button @click="startCalc">Start</b-button>
        <p>EXP last minute: {{ expLastMinute }}</p>
        <p>EXP On Average: {{ expOnAvg }}</p>
        <p>TTL: {{ ttl }}</p>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { namespace } from "nuxt-class-component";
import { ipcRenderer } from 'electron'
//~ Vuex.
import { namespace as settingStoreNamespace, IMasterState, actionType } from '~/store/welp'
const SettingStore = namespace(settingStoreNamespace)

@Component({})
export default class CalcComponent extends Vue {
    public currentExp: number = 0
    public expLastMinute: number = 0
    public expOnAvg: number = 0

    //~Moar Vuex.
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']
    
    get ttl(): number {
        console.log('from ttl', this.maxExperienceValue, this.currentExp, this.expOnAvg, (this.maxExperienceValue - this.currentExp) / this.expOnAvg)
        return Math.floor((this.maxExperienceValue - this.currentExp) / this.expOnAvg)
    }

    startCalc() {
        ipcRenderer.send('START')
    }

    mounted() {
        ipcRenderer.on('EXP_UPDATE', (event, data_object: IExpData) => {
            this.currentExp = data_object.CURRENT_EXP
            this.expLastMinute = data_object.EXP_LAST_MIN
            this.expOnAvg = data_object.EXP_ON_AVG
            console.log('Data from calc', data_object, [this.currentExp, this.expLastMinute, this.expOnAvg])
        })
    }
}
interface IExpData {
    CURRENT_EXP: number,
    EXP_LAST_MIN: number,
    EXP_ON_AVG: number
}
</script>

<style>
</style>
