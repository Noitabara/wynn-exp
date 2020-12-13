import { Configuration } from "@nuxt/types";

const config: Configuration = {
    mode: "spa",
    buildDir: "dist/.nuxt",
    generate: { dir: "dist/renderer" },
    css: ["~/assets/main.css"],
    srcDir: "src/renderer",
    build: {
        extend(config, { isClient }) {
            if (isClient) {
                config.target = "electron-renderer";
            }
        }
    },
    buildModules: ["@nuxt/typescript-build"],
    modules: ["bootstrap-vue/nuxt"]
};

export default config;
