import { defineStore } from "pinia";
import { getHuntTheme } from "../api";
import { HuntThemeColorCfg, AreaMapCfg } from "./interfaces";

export const useTheme = defineStore("theme", {
  state: () => ({
    colors: {} as HuntThemeColorCfg,
    maps: {} as Record<string, AreaMapCfg>,
    hunt: "" as string
  }),
  actions: {
    async update(hunt: string) {
      if (hunt === this.hunt) {
        getHuntTheme(hunt).then((data) => {
          console.debug(data);
          this.hunt = hunt;
          this.colors = data?.colors ?? ({} as HuntThemeColorCfg);
          this.maps = data?.maps ?? ({} as Record<string, AreaMapCfg>);
        })
      } else {
        let data = await getHuntTheme(hunt);
        console.debug(data);
        this.hunt = hunt;
        this.colors = data?.colors ?? ({} as HuntThemeColorCfg);
        this.maps = data?.maps ?? ({} as Record<string, AreaMapCfg>);
      }
    }
  },
  persist: {
    storage: localStorage,
  },
});
