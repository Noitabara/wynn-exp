<template>
    <div>
        
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
export default class LevelComponent extends Vue {
    //~Moar Vuex.
    @SettingStore.State('max_experience_value') maxExperienceValue!: IMasterState['max_experience_value']

    mounted() {
        ipcRenderer.on('EXP_INFO_UPDATE', (event, { old_amount, current_exp, change_in_exp }: IExpData) => {
            
        })
    }
}
</script>

<style>
</style>
