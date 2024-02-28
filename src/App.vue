<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner.vue'
import {
    ref
} from 'vue'
import {
    useDebounce,
} from '@vueuse/core'

function onQrScan (msg: string) {
    content.value = msg;
}

const content = ref('')

const debouncedContent = useDebounce(content, 500)
</script>

<template>
  <main>
    <textarea
        v-model="content"
    />
    <QRCodeScanner
        @result="onQrScan"
    />
    <qr-code
        :contents="content"
    />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
