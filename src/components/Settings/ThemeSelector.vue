<template>
  <div class="theme-selector-section" v-click-outside="closeThemeConfigurator">
    <div>
    <span class="theme-label">{{ $t('settings.theme-label') }}</span>
    <v-select
      :options="translatedThemes"
      v-model="selectedTheme"
      :value="$store.getters.theme"
      class="theme-dropdown"
      :tabindex="-2"
      label="label"
      :reduce="theme => theme.code"
      @input="themeChangedInUI"
    />
    </div>
    <IconPalette
      v-if="!hidePallete"
      class="color-button"
      @click="openThemeConfigurator"
      v-tooltip="$t('theme-maker.title')"
    />
    <CustomThemeMaker
      v-if="themeConfiguratorOpen"
      :themeToEdit="selectedTheme"
      @closeThemeConfigurator="closeThemeConfigurator()"
    />
  </div>
</template>

<script>

import CustomThemeMaker from '@/components/Settings/CustomThemeMaker';
import Keys from '@/utils/StoreMutations';
import IconPalette from '@/assets/interface-icons/config-color-palette.svg';
import ThemingMixin from '@/mixins/ThemingMixin';

export default {
  name: 'ThemeSelector',
  mixins: [ThemingMixin],
  props: {
    hidePallete: Boolean,
  },
  components: {
    CustomThemeMaker,
    IconPalette,
  },
  data() {
    return {
      themeConfiguratorOpen: false, // Control the opening of theme config popup
    };
  },
  computed: {
    translatedThemes() {
      return this.themeNames.map(theme => ({
        label: this.getThemeLabel(theme),
        code: theme,
      }));
    },
  },
  mounted() {
    this.initializeTheme();
  },
  methods: {
    /* Opens the theme color configurator popup */
    openThemeConfigurator() {
      this.$store.commit(Keys.SET_MODAL_OPEN, true);
      this.themeConfiguratorOpen = true;
    },
    /* Closes the theme color configurator popup */
    closeThemeConfigurator() {
      if (this.themeConfiguratorOpen) {
        this.$store.commit(Keys.SET_MODAL_OPEN, false);
        this.themeConfiguratorOpen = false;
      }
    },
    getThemeLabel(theme) {
      const themeMap = {
        default: '默认',
        glass: '毛玻璃',
        callisto: '木卫四',
        material: '质感设计',
        'material-dark': '质感暗色',
        'dashy-docs': '文档主题',
        colorful: '多彩',
        dracula: '吸血鬼',
        'one-dark': '暗黑一号',
        lissy: 'Lissy',
        'cherry-blossom': '樱花',
        'nord-frost': '北欧霜',
        nord: '北欧',
        argon: '氩气',
        fallout: '辐射',
        whimsy: '奇思妙想',
        oblivion: '遗忘',
        adventure: '冒险',
        crayola: '蜡笔',
        'deep-ocean': '深海',
        'minimal-dark': '极简暗',
        'minimal-light': '极简亮',
        thebe: '底比斯',
        matrix: '黑客帝国',
        'matrix-red': '黑客帝国红',
        'color-block': '色块',
        'raspberry-jam': '树莓酱',
        bee: '蜜蜂',
        tiger: '老虎',
        glow: '发光',
        'glow-dark': '暗夜发光',
        vaporware: '蒸汽波',
        cyberpunk: '赛博朋克',
        'material-original': '质感原版',
        'material-dark-original': '质感暗原版',
        'high-contrast-dark': '高对比暗',
        'high-contrast-light': '高对比亮',
        'adventure-basic': '冒险基础',
        basic: '基础',
        tama: '多摩',
        neomorphic: '新拟态',
        'glass-2': '毛玻璃 II',
        'night-bat': '夜蝙蝠',
      };
      return themeMap[theme] || theme;
    },
  },
};
</script>

<style lang="scss">

@import 'vue-select/src/scss/vue-select.scss';
@import '@/styles/style-helpers.scss';

.theme-dropdown {
  div.vs__dropdown-toggle {
    border-color: var(--settings-text-color);
    border-radius: var(--curve-factor);
    min-width: 8rem;
    max-width: 16rem;
    height: 1.8rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
  span.vs__selected, li.vs__dropdown-option {
    color: var(--settings-text-color);
    text-transform: capitalize;
  }
  svg.vs__open-indicator {
    fill: var(--settings-text-color);
  }
  ul.vs__dropdown-menu {
    width: auto;
    z-index: 12;
    max-width: 13rem;
    overflow-x: hidden;
    @extend .scroll-bar;
    background: var(--background);
    border-radius: var(--curve-factor);
    border-top: 1px solid var(--settings-text-color);
  }
  li.vs__dropdown-option--highlight {
    background: var(--settings-text-color);
    color: var(--background);
  }
  button.vs__clear {
    display: none;
  }
}

.theme-selector-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  span.theme-label {
    font-size: 1rem;
    color: var(--settings-text-color);
    margin: 1px 0 2px 0;
  }
}

svg.color-button {
  path {
    fill: var(--settings-text-color);
  }
  width: 1rem;
  height: 1rem;
  padding: 0.2rem;
  margin: 0.5rem;
  align-self: flex-end;
  text-align: center;
  background: var(--background);
  border: 1px solid var(--settings-text-color);;
  border-radius: var(--curve-factor);
  cursor: pointer;
  &:hover, &.selected {
    background: var(--settings-text-color);
    path { fill: var(--background); }
  }
}

</style>
