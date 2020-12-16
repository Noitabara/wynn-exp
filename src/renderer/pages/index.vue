<template>
    <b-container id="main" class="bv-example-row">
        <b-row>
            <b-col>
                <p>Technical Stuff.</p>
                <b-button @click="selectFolder">.minecraft Log Folder</b-button>
                <b-table striped sticky-header :items="currentExpLog"></b-table>
            </b-col>
            <b-col>
                <level-component/>
                <calc/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { namespace } from "nuxt-class-component";
// import Logo from "~/components/Logo.vue";
import LevelComponent from "~/components/Level.vue"
import Calc from '~/components/Calc.vue'
import { ipcRenderer } from "electron";
//~ Vuex.
import { namespace as settingStoreNamespace, IMasterState, GetterType } from '~/store/welp'
const SettingStore = namespace(settingStoreNamespace)

@Component({ components: { LevelComponent, Calc } })
export default class Index extends Vue {
    //~Moar Vuex.
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']
    @SettingStore.Getter(GetterType.CURRENT_EXP_LOG) currentExpLog!: Array<{ experience: number}>

    // public currentDirectory: string | undefined
    selectFolder() {
        ipcRenderer.send('FOLDER_OPEN')
    }
}
</script>

<style>
body {
    font-family: "Roboto";
}
.row {
    display: flex;
}

.logo-container {
    position: relative;
}

.centered {
    text-align: center;
}
#main {
    padding-top: 1em;
}
</style>
