<template>
  <modal :name="modalName" :resizable="true" width="55%" height="80%" classes="dashy-modal">
    <div class="about-modal">
      <router-link to="/about" class="title"><h2>{{ $t('app-info.title') }}</h2></router-link>
      <!-- Error Log -->
      <h3>{{ $t('app-info.error-log') }}</h3>
      <pre v-if="errorLog" class="logs"><code>{{ errorLog }}</code></pre>
      <p v-else>{{ $t('app-info.no-errors') }} :)</p>
      <hr />
      <!-- Getting Help -->
      <h3>{{ $t('app-info.help-support') }}</h3>
      {{ $t('app-info.help-support-description') }} <a href="https://github.com/tony-wang1990/laowang-nav/issues">{{ $t('app-info.help-support-discussions') }}</a>
      <!-- Please help out :) -->
      <h3>{{ $t('app-info.support-dashy') }}</h3>
      {{ $t('app-info.support-dashy-description') }} <a href="https://github.com/tony-wang1990/laowang-nav">{{ $t('app-info.support-dashy-link') }}</a>.
      <!-- Bug Reports -->
      <h3>{{ $t('app-info.report-bug') }}</h3>
      {{ $t('app-info.report-bug-description') }} <a href="https://github.com/tony-wang1990/laowang-nav/issues/new">{{ $t('app-info.report-bug-link') }}</a>.
      <!-- Source and Docs Links -->
      <h3>{{ $t('app-info.more-info') }}</h3>
      {{ $t('app-info.source') }}: <a href="https://github.com/tony-wang1990/laowang-nav">github.com/tony-wang1990/laowang-nav</a><br>
      <br>
      <i>本项目基于 <a href="https://github.com/Lissy93/dashy">Dashy</a> 开发，仅供学习交流。</i>
      <!-- Privacy & Security -->
      <h3>{{ $t('app-info.privacy-and-security') }}</h3>
      {{ $t('app-info.privacy-and-security-l1') }} <a href="#">{{ $t('app-info.privacy-and-security-privacy-policy') }}</a>.<br>
      <!-- License -->
      <h3>{{ $t('app-info.license') }}</h3>
      {{ $t('app-info.license-under') }} <a href="https://github.com/tony-wang1990/laowang-nav/blob/master/LICENSE">MIT</a>.
      Copyright <a href="https://github.com/tony-wang1990">LaoWang</a> © {{new Date().getFullYear()}}.<br>
      <!-- App Version -->
      <h3>{{ $t('app-info.version') }}</h3>
      <AppVersion class="app-version" />
    </div>
  </modal>
</template>

<script>
import AppVersion from '@/components/Configuration/AppVersion';
import { modalNames, sessionStorageKeys } from '@/utils/defaults';

export default {
  name: 'AppInfoModal',
  components: {
    AppVersion,
  },
  data() {
    return {
      modalName: modalNames.ABOUT_APP,
      appVersion: process.env.VUE_APP_VERSION,
      errorLog: this.getErrorLog(),
    };
  },
  methods: {
    getErrorLog() {
      return sessionStorage.getItem(sessionStorageKeys.ERROR_LOG) || '';
    },
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--settings-text-color);
}

div.about-modal {
  background: var(--about-page-background);
  color: var(--about-page-color);
  overflow-y: auto;
  padding: 0 1rem;
  height: 100%;
  p, ul li, a {
    font-size: 1rem;
  }

  a.title {
    text-decoration: none;
    h2 {
      font-size: 1.8rem;
      text-align: center;
      margin: 1rem;
    }
  }
  h3 {
    font-size: 1.2rem;
    margin: 0.75rem 0 0.2rem 0;
    color: var(--about-page-accent);
  }
  a {
    color: var(--about-page-accent);
  }
  a.info {
    text-decoration: underline;
    margin-left: 0.2rem;
  }
  .app-version {
    text-align: left;
  }
  pre.logs {
    max-height: 200px;
    overflow-y: auto;
    padding: 1rem;
    font-size: 0.75rem;
    border-radius: var(--curve-factor-small);
    text-align: left;
    color: var(--white);
    background: var(--black);
    white-space: pre-wrap;
  }
}

</style>

<style lang="scss">
div.about-modal {
  .app-version {
    text-align: left;
    display: flex;
    align-items: self-end;
    p { margin: 0; }
  }
}
</style>
