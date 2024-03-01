<template>
  <v-app>
    <v-main style="background-color: #d8d8d8">
        <v-container>
            <v-row>
                <v-col style="max-width: 6in" class="mx-auto">

                    <v-card>
                        <v-tabs v-model="mode">
                            <v-tab value="entry">Entry</v-tab>
                            <v-tab value="scan">Scan</v-tab>
                        </v-tabs>
            
                        <v-card-text>
                            <v-window v-model="mode">
                                <v-window-item value="entry">
                                    <ScoutingForm />
                                </v-window-item>
                                <v-window-item value="scan">
                                    <QRCodeScanner
                                        @result="onQrScan"
                                    />
                                    <br>
                                    <ContentCopy :content="content" label="Scanned Content" />
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner.vue'
import {
    ref
} from 'vue'
import ScoutingForm from './components/ScoutingForm.vue';

function onQrScan (msg: string) {
    // only add the content if it's new. While the QR is held in view, it might scan multiple times
    if (!content.value.split('\n').includes(msg)) {
        content.value += msg + '\n';
    }
}

const content = ref('')

const mode = ref('entry')
</script>
