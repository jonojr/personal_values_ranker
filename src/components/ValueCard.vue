<script setup lang="ts">
import {ValuesList} from "@/values";
import {computed} from "vue";

const props = defineProps({
  valueId: Number,
})

const value = computed(() => ValuesList[props.valueId - 1]);
</script>

<template>
  <div class="card">
    <h2 class="header">{{value.name}}</h2>
    <p>{{value.description}}</p>
  </div>
</template>

<style scoped>
.header {

}
.card {
  padding: 15px;
}

</style>