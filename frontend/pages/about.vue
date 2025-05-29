<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-light mb-8">{{ t('about.title') }}</h1>
    <div class="prose prose-lg">
      <p>{{ t('about.description') }}</p>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
</script> 