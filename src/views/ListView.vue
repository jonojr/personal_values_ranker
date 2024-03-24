<template>
<div>
  <ol>
    <li v-for="value in elo.valuesByElo" :key="value[0]" >
      {{getValueNameById(value[0])}} - {{value[1]}}
    </li>
  </ol>
  <hr>
  <button @click="elo.resetStore" class="danger">Reset rankings</button>
  </div>
</template>

<style>
</style>
<script setup lang="ts">
import {useEloStore} from "@/stores/elo";
import {ValuesList} from "@/values";


function getValueNameById(id:number){
  return ValuesList[id-1].name
}


const elo = useEloStore();
</script>