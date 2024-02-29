<template>
  <v-app>
    <v-main>
        <ScoutingForm />
        <v-textarea
            v-model="content"
            style="width:100%"
        />
        <QRCodeScanner
            @result="onQrScan"
        />
        <qr-code
            :contents="debouncedContent"
        />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner.vue'
import {
    ref
} from 'vue'
import {
    useDebounce,
} from '@vueuse/core'
import ScoutingForm from './components/ScoutingForm.vue';

function onQrScan (msg: string) {
    content.value = msg;
}

const content = ref('')

const debouncedContent = useDebounce(content, 500)
</script>
