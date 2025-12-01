<template>
    <header v-if="componentVisible">
      <div class="logo-container">
        <h1 class="text-logo">LaoWang Nav</h1>
      </div>
      <!-- PageTitle removed to prevent duplicate text -->
      <Nav v-if="navVisible" :links="pageInfo.navLinks" class="nav" />
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import { shouldBeVisible } from '@/utils/SectionHelpers';

export default {
  name: 'Header',
  components: {
    PageTitle,
    Nav,
  },
  props: {
    pageInfo: Object,
  },
  computed: {
    componentVisible() {
      return shouldBeVisible(this.$route.name);
    },
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    titleVisible() {
      return this.visibleComponents.pageTitle;
    },
    navVisible() {
      return this.visibleComponents.navigation;
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  header {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: var(--background-darker);
    align-items: center;
    align-content: flex-start;
    @include phone {
      flex-direction: column-reverse;
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    padding-left: 1rem;
  }

  .text-logo {
    font-size: 2.4rem;
    font-weight: 900;
    color: var(--primary); /* Adapts to theme */
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    background: linear-gradient(135deg, var(--primary), var(--heading-text-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
