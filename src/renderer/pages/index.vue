<template>
    <b-container id="main" class="bv-example-row">
        <b-row>
            <b-col>
                <p>Technical Stuff.</p>
                <b-button @click="selectFolder">.minecraft Log Folder</b-button>
            </b-col>
            <b-col>
                <level-component/>
            </b-col>
            <b-col>
                <calc-component v-if="maxExperienceValue" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { namespace } from "nuxt-class-component";
// import Logo from "~/components/Logo.vue";
import LevelComponent from "~/components/Level.vue"
import CalcComponent from '~/components/Calc.vue'
import { ipcRenderer } from "electron";
//~ Vuex.
import { namespace as settingStoreNamespace, IMasterState, actionType } from '~/store/welp'
const SettingStore = namespace(settingStoreNamespace)

@Component({ components: { LevelComponent, CalcComponent } })
export default class Index extends Vue {
    //~Moar Vuex.
    @SettingStore.State('current_experience_value') currentExpValue!: IMasterState['current_experience_value']
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']

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
    padding-top: 1em
}
</style>
