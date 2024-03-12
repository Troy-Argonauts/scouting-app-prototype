<template>
    <v-app>
        <v-main style="background-color: #d8d8d8">
            <v-container>
                <v-row>
                    <v-col style="max-width: 6in" class="mx-auto">
                        <v-card>
                            <v-tabs v-model="mode">
                                <v-tab value="teams">Teams</v-tab>
                                <v-tab value="entry">Entry</v-tab>
                                <v-tab value="references">References</v-tab>
                                <v-tab value="scan">Scan</v-tab>
                                <v-spacer />
                                <div class="mr-2 mt-2 d-flex align-center">
                                    <v-btn
                                        v-if="installPromptEvent"
                                        color="blue"
                                        class="mr-2"
                                        icon
                                        size="x-small"
                                        @click="promptInstall"
                                    >
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn>
                                    v{{ appVersion }}
                                </div>
                            </v-tabs>
                        </v-card>
                        <br />
                        <v-window disabled v-model="mode">
                            <v-window-item value="entry">
                                <ScoutingForm />
                            </v-window-item>
                            <v-window-item value="scan">
                                <v-card>
                                    <v-card-text>
                                        <QRCodeScanner @result="onQrScan" />
                                        <br />
                                        <ContentCopy
                                            :content="content"
                                            label="Scanned Content"
                                        />
                                    </v-card-text>
                                </v-card>
                            </v-window-item>
                            <v-window-item value="teams">
                                <TeamEntry />
                            </v-window-item>
                            <v-window-item value="references">
                                <CheatSheet />
                            </v-window-item>
                        </v-window>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner.vue';
import { ref } from 'vue';
import ScoutingForm from './components/ScoutingForm.vue';
import TeamEntry from './components/TeamEntry.vue';
import CheatSheet from './components/CheatSheet.vue';
import { installPromptEvent } from '@/pwa-helper';

function onQrScan(msg: string) {
    // only add the content if it's new. While the QR is held in view, it might scan multiple times
    if (!content.value.split('\n').includes(msg)) {
        content.value += msg + '\n';
    }
}

const content = ref('');

const mode = ref('entry');

const appVersion = APP_VERSION;

console.log('appVersion', appVersion);

function promptInstall() {
    if (!installPromptEvent.value) {
        return;
    }

    installPromptEvent.value.prompt().then(({ outcome }) => {
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installPromptEvent.value = null;
        }
    });
}
</script>
