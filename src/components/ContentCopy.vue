<template>
    <v-textarea
        :model-value="content"
        style="width: 100%"
        readonly
        no-resize
        variant="outlined"
        :label="label"
    />

    <v-btn color="deep-purple-darken-4" block @click="copyContent(content)">
        <v-icon class="mr-2">mdi-clipboard</v-icon>
        Copy to clipboard
    </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useClipboard } from '@vueuse/core';

const props = defineProps({
    content: String,
    label: String,
});

const { copy: copyContent } = useClipboard({ source: props.content });
</script>
