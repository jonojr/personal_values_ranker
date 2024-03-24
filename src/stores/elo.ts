import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {ValuesList} from "@/values";

const defaultElo: Record<number, number> = {};
const defaultVotes: Record<number, number> = {};
for (let i=0; i < ValuesList.length; i++){
  defaultElo[ValuesList[i].id] = 1500;
  defaultVotes[ValuesList[i].id] = 0;
}

// Implements a simple elo system https://en.wikipedia.org/wiki/Elo_rating_system
export const useEloStore = defineStore('elo', () => {
  const localElos = JSON.parse(localStorage.getItem("elos"));
  const localVotes = JSON.parse(localStorage.getItem("votes"));

  const elos = ref(localElos || defaultElo);
  const votes = ref(localVotes || defaultVotes);

  const valuesByElo = computed(() => {
    return Object.entries(elos.value).sort((a, b) => b[1] - a[1]);
  });
  const valuesByVotes = computed(() => {
    return Object.entries(votes.value).sort((a, b) => a[1] - b[1]);
  });
  const voteTotal = computed(() => {
    return Object.values(votes.value).reduce((acc, value) => acc + value, 0);
  });

  function resetStore (): void {
    elos.value = defaultElo;
    votes.value = defaultVotes;

    localStorage.setItem("elos", JSON.stringify(defaultElo));
    localStorage.setItem("votes", JSON.stringify(defaultVotes));
  }


  function updateElo(winningValueID: number, losingValueID: number, draw: boolean=false):void {
    const Kfactor = 32;
    const winningScore = draw ? 0.5 : 1;
    const losingScore = draw ? 0.5 : 0;

    const currentWinningElo = elos.value[winningValueID];
    const currentLosingElo = elos.value[losingValueID];

    const Qa = 10 ^ (currentWinningElo/480);
    const Qb = 10 ^ (currentLosingElo/480);

    const Ea = Qa / (Qa + Qb);
    const Eb = Qb / (Qa + Qb);

    const newWinningElo = currentWinningElo  + Kfactor * (winningScore - Ea);
    const newLosingElo = currentLosingElo  + Kfactor * (losingScore - Eb);

    elos.value[winningValueID] = newWinningElo;
    elos.value[losingValueID] = newLosingElo;

    votes.value[winningValueID]++;
    votes.value[losingValueID]++;

    localStorage.setItem("elos", JSON.stringify(elos.value));
    localStorage.setItem("votes", JSON.stringify(votes.value));
  }

  return { elos, votes, valuesByElo, valuesByVotes, voteTotal, updateElo, resetStore }
})
