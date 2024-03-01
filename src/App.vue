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
                                    <v-textarea
                                        v-model="content"
                                        style="width:100%"
                                    />
                                    <qr-code
                                        :contents="debouncedContent"
                                    />
                                </v-window-item>
                                <v-window-item value="scan">
                                    <QRCodeScanner
                                        @result="onQrScan"
                                    />
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
import {
    useDebounce,
} from '@vueuse/core'
import ScoutingForm from './components/ScoutingForm.vue';

function onQrScan (msg: string) {
    content.value = msg;
}

const content = ref('')

const debouncedContent = useDebounce(content, 500)

const mode = ref('entry')
</script>
