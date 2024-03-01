import { ref } from 'vue';

// not sure why this type isn't available globally
type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const installPromptEvent = ref<BeforeInstallPromptEvent | null>(null);

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt fired')
    // Stash the event so it can be triggered later.
    installPromptEvent.value = e as BeforeInstallPromptEvent;
});
