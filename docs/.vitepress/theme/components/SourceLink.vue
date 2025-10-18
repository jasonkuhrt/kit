<script setup lang="ts">
import { Github } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    href: string
    inline?: boolean
  }>(),
  {
    inline: false,
  },
)
</script>

<template>
  <div :class="['source-link', { inline }]">
    <a :href="href" target="_blank" rel="noopener noreferrer">
      <Github :size="inline ? 16 : 14" />
      <span v-if="!inline">Source</span>
    </a>
  </div>
</template>

<style scoped>
.source-link {
  font-size: 0.75em;
  line-height: 1.4;
  margin-top: 0.5em;
}

.source-link.inline {
  float: right;
  margin-top: 0;
  margin-left: 0.5em;
}

.source-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.source-link a:hover {
  color: var(--vp-c-brand-1);
}
</style>
