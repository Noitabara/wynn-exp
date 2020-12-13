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
            <b-col>3/3</b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component";
// import Logo from "~/components/Logo.vue";
import LevelComponent from "~/components/Level.vue"
import { remote, ipcRenderer } from "electron";

@Component({ components: { LevelComponent } })
export default class Index extends Vue {
    // public currentDirectory: string | undefined
    selectFolder() {
        ipcRenderer.send('FOLDER_OPEN')
    }
    startExp() {}
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
