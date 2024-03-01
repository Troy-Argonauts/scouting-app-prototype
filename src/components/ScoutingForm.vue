<template>
    <v-row>
        <v-col>
            <v-btn class="mb-2" block color="green" @click="resetValues">
                <v-icon class="mr-2">mdi-reload</v-icon>
                Reset Values
            </v-btn>
        </v-col>
    </v-row>

    <template v-for="field of fields">
        <v-row dense>
            <v-col>
                <v-text-field
                    v-if="field.type === 'num'"
                    v-model="values[field.id]"
                    :label="field.label"
                    :hint="field.hint"
                    type="number"
                    append-icon="mdi-close-circle"
                    @click:append="values[field.id] = ''"
                />
                <v-text-field
                    v-else-if="field.type === 'str'"
                    v-model="values[field.id]"
                    :label="field.label"
                    :hint="field.hint"
                    append-icon="mdi-close-circle"
                    @click:append="values[field.id] = ''"
                />
                <v-select
                    v-else-if="field.type === 'select'"
                    v-model="values[field.id]"
                    :label="field.label"
                    :hint="field.hint"
                    :items="field.options || []"
                    append-icon="mdi-close-circle"
                    @click:append="values[field.id] = ''"
                />
                <div
                    v-else-if="field.type === 'header'"
                    class="text-h5"
                >
                    {{ field.label }}
                </div>

                <template v-else-if="field.type === 'btn-toggle'">
                    <div class="d-flex align-center justify-center flex-column">
                        <div class="text-subtitle-1">{{ field.label }}</div>
                        <v-btn-toggle
                            v-model="values[field.id]"
                            mandatory
                            variant="outlined"
                            divided
                        >
                            <v-btn
                                v-for="btnOpt of field.btnOpts || []"
                                :value="btnOpt.value"
                                size="small"
                                :color="btnOpt.color"
                            >
                                {{ btnOpt.value }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                </template>

                <v-checkbox
                    v-else-if="field.type === 'checkbox'"
                    v-model="values[field.id]"
                    :label="field.label"
                    :hint="field.hint"
                    :true-value="field.trueValue"
                    :false-value="field.falseValue"
                />
            </v-col>
        </v-row>
    </template>
    
    <v-alert
        v-if="missingFields.length > 0"
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

    <br>

    <ContentCopy :content="qrContent" label="QR Code Content" />

    <qr-code
        :contents="qrContent"
    />
</template>

<script setup lang="ts">
import {
    computed,
} from 'vue'
import {
    useDebounce,
    useLocalStorage,
} from '@vueuse/core'
import ContentCopy from '@/components/ContentCopy.vue'

type FormField = {
    id: string;
    label: string;
    hint?: string;
} & ({
    type: 'str' | 'num' | 'header';
} | {
    type: 'select';
    options: string[];
} | {
    type: 'btn-toggle';
    btnOpts: { value: string; color?: string }[];
} | {
    type: 'checkbox';
    trueValue: string;
    falseValue: string;
})

const values = useLocalStorage<{
    [id: string]: string;
}>('idk', {});

const fields: FormField[] = [
    {
        id: 'matchNum',
        label: 'Match #',
        type: 'num',
    },
    {
        id: 'alliance',
        label: 'Alliance',
        type: 'btn-toggle',
        btnOpts: [
            { value: 'R1', color: 'red' },
            { value: 'R2', color: 'red' },
            { value: 'R3', color: 'red' },
            { value: 'B1', color: 'blue' },
            { value: 'B2', color: 'blue' },
            { value: 'B3', color: 'blue' },
        ],
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
        type: 'btn-toggle',
        // options: ['1', '2', '3', '4'],
        btnOpts: [
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
        ],
    },
    {
        id: 'preloaded',
        label: 'Preloaded',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
    },
    {
        id: 'leftStartingZone',
        label: 'Left Starting Zone',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
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
        label: 'Pickups',
        hint: 'S score | M miss',
        type: 'str',
    },
    {
        id: 'autonBreakdown',
        label: 'Auton Breakdown',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
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
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
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

/**
 * for things like checkboxes, the user might not interact with the component.
 * we need to ensure the value is set to something.
 */
function applyDefaultValues (v: typeof values) {
    const newValues = { ...values.value } // clone
    for (const field of fields) {
        if (field.type === 'checkbox' && newValues[field.id] === undefined) {
            newValues[field.id] = field.falseValue
        }
    }
    return newValues
}

const fieldsForValues = computed(() => fields.filter(field => field.type !== 'header'))

const debouncedValues = useDebounce(computed(() => applyDefaultValues(values)), 500)

const missingFields = computed(() => {
    return fieldsForValues.value.filter(field => !debouncedValues.value[field.id]);
})

const qrContent = computed(() => {
    return fieldsForValues.value.map(field => {
        const fieldValue = debouncedValues.value[field.id] || ''
        return fieldValue;
    }).join('\t')
})

function resetValues () {
    values.value = {}
}
</script>