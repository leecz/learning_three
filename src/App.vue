<template>
  <div id="app">
    <div id="nav" v-if="!isHome">
      <router-link to="/">首页</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
window.THREE = require("three");
export default {
  computed: {
    isHome() {
      return this.$route.name === "home";
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}
#nav {
  position: absolute;
  left: 5px;
  top: 5px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
