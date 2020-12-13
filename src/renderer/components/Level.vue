<template>
    <div>
        <p>Level Information:</p>
        <b-row v-if="!locked">
            <b-col>
                <b-form-select
                    v-model="selected"
                    :options="level_data"
                ></b-form-select>
            </b-col>
            <b-col>
                <p v-if="selected">{{ selectedFormatted }}</p>
            </b-col>
        </b-row>
        <b-button @click="setOurData">Set Data</b-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { namespace } from "nuxt-class-component";
//~ Vuex.
import { namespace as settingStoreNamespace, IMasterState, actionType } from '~/store/welp'
import { ipcRenderer } from "electron";
const SettingStore = namespace(settingStoreNamespace)

@Component({})
export default class LevelComponent extends Vue {
    //~Moar Vuex.
    @SettingStore.Action(actionType.SET_MAX_EXPERIENCE_VALUE) setMaxExperience!: (maxExperienceValue: number) => {}

    public locked = false

    public selected = null
    public level_data = [
        { text: 1, value: 110 },
        { text: 2, value: 190 },
        { text: 3, value: 275 },
        { text: 4, value: 385 },
        { text: 5, value: 505 },
        { text: 6, value: 645 },
        { text: 7, value: 790 },
        { text: 8, value: 940 },
        { text: 9, value: 1100 },
        { text: 10, value: 1370 },
        { text: 11, value: 1570 },
        { text: 12, value: 1800 },
        { text: 13, value: 2090 },
        { text: 14, value: 2400 },
        { text: 15, value: 2720 },
        { text: 16, value: 3100 },
        { text: 17, value: 3600 },
        { text: 18, value: 4150 },
        { text: 19, value: 4800 },
        { text: 20, value: 5300 },
        { text: 21, value: 5900 },
        { text: 22, value: 6750 },
        { text: 23, value: 7750 },
        { text: 24, value: 8900 },
        { text: 25, value: 10200 },
        { text: 26, value: 11650 },
        { text: 27, value: 13300 },
        { text: 28, value: 15200 },
        { text: 29, value: 17150 },
        { text: 30, value: 19600 },
        { text: 31, value: 22100 },
        { text: 32, value: 24900 },
        { text: 33, value: 28000 },
        { text: 34, value: 31500 },
        { text: 35, value: 35500 },
        { text: 36, value: 39900 },
        { text: 37, value: 44700 },
        { text: 38, value: 50000 },
        { text: 39, value: 55800 },
        { text: 40, value: 62000 },
        { text: 41, value: 68800 },
        { text: 42, value: 76400 },
        { text: 43, value: 84700 },
        { text: 44, value: 93800 },
        { text: 45, value: 103800 },
        { text: 46, value: 114800 },
        { text: 47, value: 126800 },
        { text: 48, value: 140000 },
        { text: 49, value: 154500 },
        { text: 50, value: 170300 },
        { text: 51, value: 187600 },
        { text: 52, value: 206500 },
        { text: 53, value: 227000 },
        { text: 54, value: 249500 },
        { text: 55, value: 274000 },
        { text: 56, value: 300500 },
        { text: 57, value: 329500 },
        { text: 58, value: 361000 },
        { text: 59, value: 395000 },
        { text: 60, value: 432200 },
        { text: 61, value: 472300 },
        { text: 62, value: 515800 },
        { text: 63, value: 562800 },
        { text: 64, value: 613700 },
        { text: 65, value: 668600 },
        { text: 66, value: 728000 },
        { text: 67, value: 792000 },
        { text: 68, value: 860000 },
        { text: 69, value: 935000 },
        { text: 70, value: 1040400 },
        { text: 71, value: 1154400 },
        { text: 72, value: 1282600 },
        { text: 73, value: 1414800 },
        { text: 74, value: 1567500 },
        { text: 75, value: 1730400 },
        { text: 76, value: 1837000 },
        { text: 77, value: 1954800 },
        { text: 78, value: 2077600 },
        { text: 79, value: 2194400 },
        { text: 80, value: 2325600 },
        { text: 81, value: 2455000 },
        { text: 82, value: 2645000 },
        { text: 83, value: 2845000 },
        { text: 84, value: 3141100 },
        { text: 85, value: 3404710 },
        { text: 86, value: 3782160 },
        { text: 87, value: 4151400 },
        { text: 88, value: 4604100 },
        { text: 89, value: 5057300 },
        { text: 90, value: 5533840 },
        { text: 91, value: 6087120 },
        { text: 92, value: 6685120 },
        { text: 93, value: 7352800 },
        { text: 94, value: 8080800 },
        { text: 95, value: 8725600 },
        { text: 96, value: 9578400 },
        { text: 97, value: 10545600 },
        { text: 98, value: 11585600 },
        { text: 99, value: 12740000 },
        { text: 100, value: 14418250 },
        { text: 101, value: 16280000 },
        { text: 102, value: 21196500 },
        { text: 103, value: 23315500 },
        { text: 104, value: 25649000 },
        { text: 105, value: 249232940 },
    ]

    get selectedFormatted(): number | null {
        return this.selected?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    setOurData() {
        this.setMaxExperience(this.selected)
    }
}
</script>

<style>
</style>
