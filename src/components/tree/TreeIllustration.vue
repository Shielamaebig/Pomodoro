<template>
  <div
    class="tree-illustration-container"
    :class="[`species-${species}`, `stage-${stage}`, { celebration: isCelebration || stage === 5 }]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- Background subtle aura for stage 5 / celebration -->
    <div v-if="stage === 5 || isCelebration" class="celebration-aura" />

    <svg
      viewBox="0 0 100 100"
      class="tree-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Gradients -->
        <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8D6E63" />
          <stop offset="100%" stop-color="#5D4037" />
        </linearGradient>

        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#6D4C41" />
          <stop offset="60%" stop-color="#8D6E63" />
          <stop offset="100%" stop-color="#5D4037" />
        </linearGradient>

        <!-- Oak Gradients -->
        <linearGradient id="oakLeaves" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
        <linearGradient id="oakLeavesLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#81C784" />
          <stop offset="100%" stop-color="#388E3C" />
        </linearGradient>

        <!-- Pine Gradients -->
        <linearGradient id="pineLeaves" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2E7D32" />
          <stop offset="100%" stop-color="#1B5E20" />
        </linearGradient>
        <linearGradient id="pineLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#43A047" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>

        <!-- Cherry Gradients -->
        <linearGradient id="cherryLeaves" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F8BBD0" />
          <stop offset="70%" stop-color="#F06292" />
          <stop offset="100%" stop-color="#E91E63" />
        </linearGradient>
        <linearGradient id="cherryLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFF0F5" />
          <stop offset="100%" stop-color="#F48FB1" />
        </linearGradient>

        <!-- Maple Gradients -->
        <linearGradient id="mapleLeaves" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFA726" />
          <stop offset="60%" stop-color="#FB8C00" />
          <stop offset="100%" stop-color="#E65100" />
        </linearGradient>
        <linearGradient id="mapleRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EF5350" />
          <stop offset="100%" stop-color="#C62828" />
        </linearGradient>

        <!-- Flowering Gradients -->
        <linearGradient id="flowerLeaves" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#66BB6A" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
        <linearGradient id="flowerPetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#FFF59D" />
        </linearGradient>

        <!-- Gold Glow Filter -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- BASE SOIL MOUND (Shared for all) -->
      <ellipse cx="50" cy="88" rx="26" ry="6" fill="url(#soilGrad)" opacity="0.85" />
      <ellipse cx="50" cy="87" rx="22" ry="4" fill="#A1887F" opacity="0.4" />

      <!-- ============================================== -->
      <!-- STAGE 0: SEED (0 - 10%)                         -->
      <!-- ============================================== -->
      <g v-if="stage === 0" class="stage-anim-entry">
        <!-- Seed casing in soil -->
        <ellipse cx="50" cy="84" rx="6" ry="4" fill="#6D4C41" />
        <ellipse cx="50" cy="83" rx="4.5" ry="2.5" fill="#8D6E63" />
        <!-- Little green germ crack -->
        <path d="M 49 84 Q 50 80 52 79" stroke="#81C784" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle cx="52" cy="79" r="1.5" fill="#A5D6A7" />
        <!-- Moisture glint -->
        <circle cx="48" cy="82" r="1" fill="#FFFFFF" opacity="0.6" />
      </g>

      <!-- ============================================== -->
      <!-- STAGE 1: SPROUT (10 - 30%)                      -->
      <!-- ============================================== -->
      <g v-else-if="stage === 1" class="stage-anim-entry sway">
        <!-- Tender Green Stem -->
        <path d="M 50 85 Q 49 76 50 68" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- Left Cotyledon Leaf -->
        <path d="M 50 71 Q 42 67 43 62 C 45 61 50 65 50 70" fill="#81C784" />
        <!-- Right Cotyledon Leaf -->
        <path d="M 50 70 Q 58 65 57 60 C 54 59 50 64 50 69" fill="#A5D6A7" />
      </g>

      <!-- ============================================== -->
      <!-- STAGE 2: SMALL PLANT (30 - 55%)                 -->
      <!-- ============================================== -->
      <g v-else-if="stage === 2" class="stage-anim-entry sway">
        <!-- Small Woody Stem -->
        <path d="M 50 86 Q 49 73 50 60" stroke="#795548" stroke-width="3" stroke-linecap="round" fill="none" />
        
        <!-- Lower Leaf pair -->
        <path d="M 50 72 C 40 70 38 64 42 61 C 46 62 49 68 50 72" :fill="speciesColorLight" />
        <path d="M 50 71 C 60 69 62 63 58 60 C 54 61 51 67 50 71" :fill="speciesColorMain" />

        <!-- Upper Sprout pair -->
        <path d="M 50 62 C 43 56 42 49 47 48 C 50 50 50 58 50 62" :fill="speciesColorMain" />
        <path d="M 50 61 C 57 55 58 48 53 47 C 50 49 50 57 50 61" :fill="speciesColorLight" />
        
        <!-- Tiny Species Accents -->
        <circle v-if="species === 'cherry'" cx="50" cy="50" r="2.5" fill="#F48FB1" />
        <circle v-else-if="species === 'flowering'" cx="50" cy="50" r="2" fill="#FFF59D" />
        <circle v-else cx="50" cy="52" r="1.5" :fill="speciesColorLight" />
      </g>

      <!-- ============================================== -->
      <!-- STAGE 3: YOUNG TREE (55 - 80%)                  -->
      <!-- ============================================== -->
      <g v-else-if="stage === 3" class="stage-anim-entry sway">
        <!-- Trunk with branches -->
        <path d="M 50 86 L 50 56 M 50 68 L 44 58 M 50 65 L 56 56" stroke="url(#trunkGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        <!-- Species Specific Young Foliage -->
        <!-- PINE -->
        <g v-if="species === 'pine'">
          <polygon points="50,38 34,58 66,58" fill="url(#pineLeaves)" />
          <polygon points="50,28 37,46 63,46" fill="url(#pineLight)" />
        </g>
        <!-- OAK -->
        <g v-else-if="species === 'oak'">
          <circle cx="50" cy="46" r="15" fill="url(#oakLeaves)" />
          <circle cx="42" cy="52" r="10" fill="url(#oakLeavesLight)" />
          <circle cx="58" cy="52" r="10" fill="url(#oakLeavesLight)" />
          <circle cx="50" cy="38" r="11" fill="url(#oakLeavesLight)" />
        </g>
        <!-- CHERRY -->
        <g v-else-if="species === 'cherry'">
          <circle cx="50" cy="46" r="14" fill="url(#cherryLeaves)" />
          <circle cx="42" cy="50" r="10" fill="url(#cherryLight)" />
          <circle cx="58" cy="50" r="10" fill="url(#cherryLight)" />
          <circle cx="50" cy="38" r="10" fill="#FFF0F5" opacity="0.9" />
        </g>
        <!-- MAPLE -->
        <g v-else-if="species === 'maple'">
          <circle cx="50" cy="46" r="14" fill="url(#mapleLeaves)" />
          <circle cx="41" cy="50" r="10" fill="url(#mapleRed)" />
          <circle cx="59" cy="50" r="10" fill="url(#mapleLeaves)" />
          <circle cx="50" cy="38" r="11" fill="#FFB74D" />
        </g>
        <!-- FLOWERING -->
        <g v-else>
          <circle cx="50" cy="46" r="14" fill="url(#flowerLeaves)" />
          <circle cx="42" cy="51" r="10" fill="#81C784" />
          <circle cx="58" cy="51" r="10" fill="#81C784" />
          <circle cx="50" cy="38" r="10" fill="#A5D6A7" />
          <!-- Small flowers -->
          <circle cx="45" cy="44" r="2.5" fill="#FFFFFF" />
          <circle cx="45" cy="44" r="1" fill="#FDD835" />
          <circle cx="55" cy="42" r="2.5" fill="#FFFFFF" />
          <circle cx="55" cy="42" r="1" fill="#FDD835" />
        </g>
      </g>

      <!-- ============================================== -->
      <!-- STAGE 4 & 5: MATURE TREE (80 - 100%)            -->
      <!-- ============================================== -->
      <g v-else class="stage-anim-entry sway">
        <!-- Robust Trunk -->
        <path d="M 47 88 L 48 52 C 48 48 45 44 42 42 M 52 52 C 52 48 55 43 59 40 M 50 50 L 50 38" stroke="url(#trunkGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        <!-- 1. PINE TREE -->
        <g v-if="species === 'pine'">
          <polygon points="50,54 26,72 74,72" fill="url(#pineLeaves)" />
          <polygon points="50,40 30,58 70,58" fill="url(#pineLight)" />
          <polygon points="50,26 35,44 65,44" fill="url(#pineLeaves)" />
          <polygon points="50,14 40,30 60,30" fill="url(#pineLight)" />
        </g>

        <!-- 2. OAK TREE -->
        <g v-else-if="species === 'oak'">
          <!-- Canopy Cloud Clusters -->
          <circle cx="50" cy="40" r="22" fill="url(#oakLeaves)" />
          <circle cx="36" cy="46" r="16" fill="url(#oakLeavesLight)" />
          <circle cx="64" cy="46" r="16" fill="url(#oakLeaves)" />
          <circle cx="36" cy="34" r="14" fill="url(#oakLeavesLight)" />
          <circle cx="64" cy="34" r="14" fill="url(#oakLeavesLight)" />
          <circle cx="50" cy="26" r="16" fill="#81C784" />
        </g>

        <!-- 3. CHERRY BLOSSOM TREE -->
        <g v-else-if="species === 'cherry'">
          <circle cx="50" cy="40" r="22" fill="url(#cherryLeaves)" />
          <circle cx="35" cy="46" r="16" fill="url(#cherryLight)" />
          <circle cx="65" cy="46" r="16" fill="url(#cherryLeaves)" />
          <circle cx="37" cy="34" r="14" fill="url(#cherryLight)" />
          <circle cx="63" cy="34" r="14" fill="#F8BBD0" />
          <circle cx="50" cy="25" r="16" fill="#FFF0F5" />
          <!-- Little blossom petals -->
          <circle cx="30" cy="42" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="68" cy="40" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="52" cy="22" r="2" fill="#FCE4EC" />
        </g>

        <!-- 4. MAPLE TREE -->
        <g v-else-if="species === 'maple'">
          <circle cx="50" cy="40" r="22" fill="url(#mapleLeaves)" />
          <circle cx="35" cy="46" r="16" fill="url(#mapleRed)" />
          <circle cx="65" cy="46" r="16" fill="url(#mapleLeaves)" />
          <circle cx="37" cy="33" r="14" fill="#FFB74D" />
          <circle cx="63" cy="33" r="14" fill="url(#mapleRed)" />
          <circle cx="50" cy="24" r="16" fill="#FFA726" />
        </g>

        <!-- 5. FLOWERING TREE -->
        <g v-else>
          <circle cx="50" cy="40" r="22" fill="url(#flowerLeaves)" />
          <circle cx="36" cy="46" r="16" fill="#66BB6A" />
          <circle cx="64" cy="46" r="16" fill="#388E3C" />
          <circle cx="36" cy="33" r="14" fill="#81C784" />
          <circle cx="64" cy="33" r="14" fill="#81C784" />
          <circle cx="50" cy="25" r="16" fill="#A5D6A7" />
          <!-- White & Gold Flowers -->
          <circle cx="34" cy="44" r="3.2" fill="#FFFFFF" />
          <circle cx="34" cy="44" r="1.3" fill="#FDD835" />
          <circle cx="62" cy="42" r="3.2" fill="#FFFFFF" />
          <circle cx="62" cy="42" r="1.3" fill="#FDD835" />
          <circle cx="48" cy="24" r="3.2" fill="#FFFFFF" />
          <circle cx="48" cy="24" r="1.3" fill="#FDD835" />
          <circle cx="44" cy="36" r="2.8" fill="#FFFFFF" />
          <circle cx="44" cy="36" r="1.1" fill="#FDD835" />
          <circle cx="56" cy="32" r="2.8" fill="#FFFFFF" />
          <circle cx="56" cy="32" r="1.1" fill="#FDD835" />
        </g>

        <!-- STAGE 5 CELEBRATION SPARKLES & GLOW -->
        <g v-if="stage === 5" class="sparkles-group">
          <!-- Sparkle 1 -->
          <path d="M 22 26 L 24 20 L 26 26 L 32 28 L 26 30 L 24 36 L 22 30 L 16 28 Z" fill="#FBBF24" opacity="0.9" class="sparkle s1" />
          <!-- Sparkle 2 -->
          <path d="M 76 22 L 77.5 17 L 79 22 L 84 23.5 L 79 25 L 77.5 30 L 76 25 L 71 23.5 Z" fill="#FDE047" opacity="0.9" class="sparkle s2" />
          <!-- Sparkle 3 -->
          <path d="M 50 8 L 51.5 3 L 53 8 L 58 9.5 L 53 11 L 51.5 16 L 50 11 L 45 9.5 Z" fill="#FBBF24" opacity="0.95" class="sparkle s3" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TreeSpecies, TreeStage } from '../../types/tree';

const props = withDefaults(
  defineProps<{
    species?: TreeSpecies;
    stage?: TreeStage;
    size?: number;
    isCelebration?: boolean;
  }>(),
  {
    species: 'oak',
    stage: 0,
    size: 80,
    isCelebration: false,
  }
);

const speciesColorMain = computed(() => {
  switch (props.species) {
    case 'pine': return '#2E7D32';
    case 'cherry': return '#F06292';
    case 'maple': return '#FB8C00';
    case 'flowering': return '#43A047';
    case 'oak':
    default:
      return '#388E3C';
  }
});

const speciesColorLight = computed(() => {
  switch (props.species) {
    case 'pine': return '#43A047';
    case 'cherry': return '#F8BBD0';
    case 'maple': return '#FFB74D';
    case 'flowering': return '#81C784';
    case 'oak':
    default:
      return '#81C784';
  }
});
</script>

<style scoped>
.tree-illustration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
}

.tree-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.12));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Entry Animation on stage change */
.stage-anim-entry {
  animation: stagePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-origin: 50% 85%;
}

@keyframes stagePop {
  0% {
    transform: scale(0.92);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Gentle wind sway */
.sway {
  animation: gentleSway 5s ease-in-out infinite alternate;
  transform-origin: 50% 88%;
}

@keyframes gentleSway {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0.8deg);
  }
  100% {
    transform: rotate(-0.8deg);
  }
}

/* Celebration Aura */
.celebration-aura {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: auraPulse 3s ease-in-out infinite alternate;
}

@keyframes auraPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

/* Sparkles animation */
.sparkles-group .sparkle {
  transform-origin: center;
  animation: sparkleTwinkle 2s ease-in-out infinite alternate;
}

.s1 {
  animation-delay: 0.2s;
}
.s2 {
  animation-delay: 0.7s;
}
.s3 {
  animation-delay: 1.2s;
}

@keyframes sparkleTwinkle {
  0% {
    transform: scale(0.7) rotate(0deg);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.15) rotate(15deg);
    opacity: 1;
  }
}
</style>
