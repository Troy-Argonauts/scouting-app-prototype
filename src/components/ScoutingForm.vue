<template>
    <v-row>
        <v-col>
            <v-btn class="mb-2" block color="green" @click="resetValues">
                <v-icon class="mr-2">mdi-reload</v-icon>
                Reset Values
            </v-btn>
        </v-col>
    </v-row>

    <template v-for="group of fieldGroups">
        <v-card>
            <v-card-title>
                {{ group.header }}
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <template v-for="field of fieldsByGroup[group.id]">
                        <v-col :cols="field.cols ?? 12">
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

                            <v-text-field
                                v-else-if="field.type === 'charCount'"
                                v-model="values[field.id]"
                                :label="field.label"
                                :hint="field.hint"
                                append-icon="mdi-plus-circle"
                                prepend-icon="mdi-minus-circle"
                                counter
                                persistent-counter
                                @click:append="values[field.id] = (values[field.id] || '') + 'x'"
                                @click:prepend="values[field.id] = (values[field.id] || '').slice(0, -1)"
                            />

                            <v-text-field
                                v-else-if="field.type === 'counter'"
                                v-model="values[field.id]"
                                :label="field.label"
                                :hint="field.hint"
                                type="number"
                                min="0"
                                append-icon="mdi-plus-circle"
                                prepend-icon="mdi-minus-circle"
                                @click:append="values[field.id] = String(Number(values[field.id] || '0') + 1)"
                                @click:prepend="values[field.id] = String(Math.max(Number(values[field.id] || '0') - 1, field.min ?? 0))"
                            />

                        </v-col>
                    </template>
                </v-row>
            </v-card-text>
        </v-card>
        <br>
    </template>
    <v-card>
        <v-card-text>
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
        <v-img src="../assets/PP.png" />
    </v-card-text>
    </v-card>
    
</template>

<script setup lang="ts">
import {
    
    computed,
    ref,
} from 'vue'
import {
    useDebounce,
    useLocalStorage,
} from '@vueuse/core'
import ContentCopy from '@/components/ContentCopy.vue'

type Group = {
    id: 'prematch' | 'auton' | 'teleop' | 'endgame';
    header: string;
}

type FormField = {
    id: string;
    label: string;
    hint?: string;
    allowEmpty?: boolean;
    cols?: number;
    group: Group['id'];
} & ({
    type: 'str' | 'num';
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
} | {
    type: 'charCount';
} | {
    type: 'counter';
    min?: number;
})

const values = useLocalStorage<{
    [id: string]: string;
}>('idk', {});

const fields: FormField[] = [
    // {
    //     id: 'name',
    //     label: 'Your Name',
    //     type: 'str',
    // },
    {
        id: 'matchNum',
        label: 'Match #',
        type: 'num',
        group: 'prematch',
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
        group: 'prematch',
    },
    {
        id: 'teamNum',
        label: 'Team #',
        type: 'num',
        group: 'prematch',
    },
    {
        id: 'startingPosition',
        label: 'Starting Position',
        type: 'btn-toggle',
        btnOpts: [
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
        ],
        group: 'prematch',
    },
    {
        id: 'preloaded',
        label: 'Preloaded',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
        group: 'auton',
    },
    {
        id: 'leftStartingZone',
        label: 'Left Starting Zone',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
        group: 'auton',
    },
    {
        id: 'ampScoreAuton',
        label: 'Amp Scores',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'ampMissAuton',
        label: 'Amp Misses',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'speakerScoreAuton',
        label: 'Speaker Scores',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'speakerMissAuton',
        label: 'Speaker Misses',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'wingScoreAuton',
        label: 'Wing Scores',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'wingMissAuton',
        label: 'Wing Misses',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'autonBreakdown',
        label: 'Auton Breakdown',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
        group: 'auton',
    },
    {
        id: 'teleopAmp',
        label: 'Amp',
        type: 'charCount',
        hint: 'any character',
        allowEmpty: true,
        group: 'teleop',
    },
    {
        id: 'teleopSpeaker',
        label: 'Speaker',
        hint: 'N not amplified | A amplified',
        allowEmpty: true,
        type: 'str',
        group: 'teleop',
    },
    {
        id: 'trap',
        label: 'Trap',
        type: 'select',
        options: ['none', '1', '2', '3'],
        group: 'teleop',
    },
    {
        id: 'unclimb',
        label: 'Unclimb',
        type: 'checkbox',
        trueValue: 'yes',
        falseValue: 'no',
        group: 'teleop',
    },
    {
        id: 'onstagePark',
        label: 'Onstage/Park',
        type: 'select',
        options: ['alone', 'park', 'none', 'w/ 1', 'w/ 2'],
        group: 'endgame',
    },
    {
        id: 'onstagePosition',
        label: 'Onstage Position',
        type: 'select',
        options: ['none', 'left', 'center', 'right'],
        group: 'endgame',
    },
    {
        id:'pickupLocation',
        label: 'Pickup Location',
        type: 'select',
        options: ['none', 'floor', 'source', 'both'],
        group: 'endgame',
    }, 
    {
        id: 'teleopBreakdown',
        label: 'Teleop Breakdowns',
        type: 'select',
        options: ['yes', 'half', 'no'],
        group: 'endgame',
    },
    {
        id: 'playStyle',
        label: 'Play Style',
        type: 'select',
        options: ['none', 'offense', 'defense', 'both'],
        group: 'endgame',
    }
];

const fieldGroups: Group[] = [
    {
        id: 'prematch',
        header: 'Prematch',
    },
    {
        id: 'auton',
        header: 'Auton',
    },
    {
        id: 'teleop',
        header: 'Teleop',
    },
    {
        id: 'endgame',
        header: 'End Game',
    },
]

const fieldsByGroup: {
    [groupId: string]: FormField[];
} = {};
for (const field of fields) {
    const group = fieldsByGroup[field.group] || [];
    fieldsByGroup[field.group] = group;
    group.push(field);
}

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
        if (field.type === 'counter' && newValues[field.id] === undefined) {
            newValues[field.id] = '0'
        }
        // if (field.type === 'counter' && Number(newValues[field.id]) < 0) {
        //     newValues[field.id] = '0'
        // }
    }
    return newValues
}

const debouncedValues = useDebounce(computed(() => applyDefaultValues(values)), 500)

const missingFields = computed(() => {
    return fields.filter(field => !debouncedValues.value[field.id] && field.allowEmpty !== true);
})

const qrContent = computed(() => {
    // const valuesIguess = fieldsForValues.value.map(field => values.value[field.id]);
    // const valuesThatDefinitelyHaveStrings = valuesIguess.map(val => val || '');
    // const finalStringContent = valuesThatDefinitelyHaveStrings.join('\t')
    return fields.map(field => {
        const fieldValue = debouncedValues.value[field.id] || ''
        return fieldValue;
    }).join('\t')
})

function resetValues () {
    if (confirm('Are you sure you want to reset all values?')) {
        values.value = {
            // fields that don't reset
            // name: values.value.name,
            alliance: values.value.alliance,
        }
    }
}
</script>