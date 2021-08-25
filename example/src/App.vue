<template>
  <img class="image" alt="" src="./assets/girl.jpg" @click="handleImageZoom" />
</template>

<script lang="ts" setup>
  // import '../../dist/index.css'
  // import handleImageZoom from '../../src'
  import 'handle-image-zoom/dist/index.css'
  import handleImageZoom from 'handle-image-zoom'
</script>

<style>
  body {
    margin: 0;
  }
  .image {
    width: 400px;
  }
</style>
