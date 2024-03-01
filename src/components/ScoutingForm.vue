<template>
    <template v-for="field of fields">
        <v-text-field
            v-if="field.type === 'num'"
            v-model="values[field.id]"
            :label="field.label"
            :hint="field.hint"
            type="number"
        />
        <v-text-field
            v-else-if="field.type === 'str'"
            v-model="values[field.id]"
            :label="field.label"
            :hint="field.hint"
        />
        <v-select
            v-else-if="field.type === 'select'"
            v-model="values[field.id]"
            :label="field.label"
            :hint="field.hint"
            :items="field.options || []"
        />
        <div
            v-else-if="field.type === 'header'"
            class="text-h5"
        >
            {{ field.label }}
        </div>
    </template>
    
    <v-alert
        type="error"
    >
        All form fields must be filled out! Missing fields:
        <ul>
            <li
                v-for="missingField of missingFields"
                class="ml-2"
            >
                💩 {{ missingField.label }} ({{ missingField.id }})
            </li>
        </ul>
    </v-alert>
</template>

<script setup lang="ts">
import {
    reactive,
    computed,
    ComputedGetter,
} from 'vue'
import {
    useDebounce,
} from '@vueuse/core'

type FormField = {
    id: string;
    label: string;
    type: 'str' | 'num' | 'select' | 'header';
    hint?: string;
    options?: string[]; // only if `type: 'select'`
}

const values = reactive<{
    [id: string]: string;
}>({})

function convertValuesToCode (v: typeof values): string {
    // stub
    // needs to implement the process used in the excel sheet
}

const fields: FormField[] = [
    {
        id: 'matchNum',
        label: 'Match #',
        type: 'num',
    },
    {
        id: 'alliance',
        label: 'Alliance',
        type: 'select',
        options: [ 'R1', 'R2', 'R3', 'B1', 'B2', 'B3' ],
    },
    {
        id: 'teamNum',
        label: 'Team #',
        type: 'num',
    },
    {
        id: 'headerAuton',
        label: 'Auton',
        type: 'header',
    },
    {
        id: 'startingPosition',
        label: 'Starting Position',
        type: 'select',
        options: ['1', '2', '3', '4'],
    },
    {
        id: 'preloaded',
        label: 'Preloaded',
        type: 'select',
        options: ['yes', 'no'],
    },
    {
        id: 'leftStartingZone',
        label: 'Left Starting Zone',
        type: 'select',
        options: ['yes', 'no'],
    },
    {
        id: 'ampAuton',
        label: 'Amp',
        hint: 'S score | M miss',
        type: 'str',
    },
    {
        id: 'speakerAuton',
        label: 'Speaker',
        hint: 'S score | M miss',
        type: 'str',
    },
    {
        id: 'wingPickupAuton',
        label: 'Speaker',
        hint: 'S score | M miss',
        type: 'str',
    },
    {
        id: 'autonBreakdown',
        label: 'Auton Breakdown',
        type: 'select',
        options: ['yes', 'no'],
    },
    {
        id: 'headerTeleop',
        label: 'Teleop',
        type: 'header',
    },
    {
        id: 'teleopAmp',
        label: 'Amp',
        type: 'str',
    },
    {
        id: 'teleopSpeaker',
        label: 'Speaker',
        hint: 'N not amplified | A amplified',
        type: 'str',
    },
    {
        id: 'trap',
        label: 'Trap',
        type: 'select',
        options: ['none', '1', '2', '3'],
    },
    {
        id: 'unclimb',
        label: 'Unclimb',
        type: 'select',
        options: ['yes','no']
    },
    {
        id: 'headerEndgame',
        label: 'End Game',
        type: 'header',
    },
    {
        id: 'onstagePark',
        label: 'Onstage/Park',
        type: 'select',
        options: ['alone', 'park', 'none', 'w/ 1', 'w/ 2'],
    },
    {
        id: 'onstagePosition',
        label: 'Onstage Position',
        type: 'select',
        options: ['none', 'left', 'center', 'right'],
    },
    {
        id: 'headerAttrs',
        label: 'Attributes',
        type: 'header',
    },
    {
        id:'pickupLocation',
        label: 'Pickup Location',
        type: 'select',
        options: ['none', 'floor', 'source', 'both'],
    }, 
    {
        id: 'teleopBreakdown',
        label: 'Teleop Breakdowns',
        type: 'select',
        options: ['yes', 'half', 'no'],
    },
    {
        id: 'playStyle',
        label: 'Play Style',
        type: 'select',
        options: ['none', 'offense', 'defense', 'both']
    }

];

const debouncedValues = useDebounce(computed(() => ({ ...values })), 500)

const missingFields = computed(() => {
    return fields.filter(field => !debouncedValues.value[field.id]);
})

</script>