<template>
  <div class="container">
    <value-card :value-id="leftIndex" />
    <value-card :value-id="rightIndex" />
  </div>
  <div>
    Vote count: {{elo.voteTotal}}
    <br>
    Expected votes to stability: {{3000 - elo.voteTotal}}
    <br>
    % completion: {{(elo.voteTotal / 3000) * 100}}%
  </div>
</template>

<style>
.container {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>
<script setup lang="ts">
import {useEloStore} from "@/stores/elo";
import {onBeforeUnmount, onMounted, ref} from "vue";
import ValueCard from "@/components/ValueCard.vue";
import {nativeMath, sample} from "random-js";

const elo = useEloStore();

const leftIndex = ref(1);
const rightIndex = ref(1);

function chooseNewOptions() {
  const minVoteCount = elo.valuesByVotes[0][1];

  const MAX_VOTE_DIFFERENTIAL = Math.min(minVoteCount, 2);

  let allowedChoices = elo.valuesByVotes.filter(obj => obj[1] <= minVoteCount + MAX_VOTE_DIFFERENTIAL);

   let selected = sample(nativeMath, allowedChoices, 2);

   leftIndex.value = Number(selected[0][0]);
   rightIndex.value = Number(selected[1][0]);
}


function handleKeypress(event:KeyboardEvent) {
  switch (event.key){
    case "ArrowLeft":
      elo.updateElo(leftIndex.value, rightIndex.value);
      chooseNewOptions();
      break;
    case "ArrowRight":
      elo.updateElo(rightIndex.value, leftIndex.value);
      chooseNewOptions();
      break;
    case "ArrowUp":
      // Allow for even matches
      elo.updateElo(leftIndex.value, rightIndex.value, true);
      chooseNewOptions();
      break;
    case "ArrowDown":
      // Allow for re-rolling options without choosing.
      chooseNewOptions();
      break;
  }

}

onMounted(() => {
  window.addEventListener('keyup', handleKeypress)
  chooseNewOptions();
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeypress)
})


</script>