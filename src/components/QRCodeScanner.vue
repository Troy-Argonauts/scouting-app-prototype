<template>
    <div id="qr-code-full-region"></div>
</template>

<script setup lang="ts">
import {
    onMounted,
    onBeforeUnmount,
    defineEmits,
    ref,
} from 'vue';
import {
    Html5QrcodeScanner,
    type Html5QrcodeResult,
} from 'html5-qrcode';

const emit = defineEmits<{
    result: [string, Html5QrcodeResult],
    error: [string],
}>();

const scanner = ref<Html5QrcodeScanner>()

onMounted(() => {
    const config = {
        fps: 10,
        qrbox: 240,
    };
    scanner.value = new Html5QrcodeScanner('qr-code-full-region', config, false);
    scanner.value.render((msg, result) => {
        emit('result', msg, result);
    }, (msg) => {
        emit('error', msg);
    });
});

onBeforeUnmount(() => {
    if (scanner.value) {
        scanner.value.clear()
    }
});

const conten = ['1', '2', '3'];
function qr_content() {
    
    return conten;
}

</script>
