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
        <v-card
            class="mx-auto"
            image="../assets/midnightBlurple.jpg"
            theme="dark"
        >
            <v-card-title>
                {{ group.header }}
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <template v-for="field of fieldsByGroup[group.id]">
                        <v-col :cols="field.cols ?? 12">
                            <v-expansion-panels>
                                <v-expansion-panel
                                    v-if="field.type === 'expansion-panel'"
                                    :title="field.label"
                                    :text= "field.contents"
                                    bg-color='black'
                                >
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-autocomplete
                                v-if="field.type === 'autocomplete'"
                                :label="field.label"
                                :items="field.items"
                            ></v-autocomplete>

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
                                <div
                                    class="d-flex align-center justify-center flex-column"
                                >
                                    <div class="text-subtitle-1">
                                        {{ field.label }}
                                        <v-btn
                                            variant="text"
                                            icon="mdi-close-circle"
                                            @click="values[field.id] = ''"
                                        />
                                    </div>
                                    <v-btn-toggle
                                        rounded="LG"
                                        v-model="values[field.id]"
                                        variant="outlined"
                                        divided
                                    >
                                        <v-btn
                                            v-for="btnOpt of field.btnOpts ||
                                            []"
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
                                @click:append="
                                    values[field.id] =
                                        (values[field.id] || '') + 'x'
                                "
                                @click:prepend="
                                    values[field.id] = (
                                        values[field.id] || ''
                                    ).slice(0, -1)
                                "
                            />

                            <v-text-field
                                v-else-if="field.type === 'counter'"
                                v-model="values[field.id]"
                                :label="field.label"
                                :hint="field.hint"
                                type="number"
                                :min="field.min ?? 0"
                                :max="field.max ?? 99"
                                append-icon="mdi-plus-circle"
                                prepend-icon="mdi-minus-circle"
                                @click:append="
                                    values[field.id] = String(
                                        Math.min(
                                            Number(values[field.id] || '0') + 1,
                                            field.max ?? 99
                                        )
                                    )
                                "
                                @click:prepend="
                                    values[field.id] = String(
                                        Math.max(
                                            Number(values[field.id] || '0') - 1,
                                            field.min ?? 0
                                        )
                                    )
                                "
                            />
                        </v-col>
                    </template>
                </v-row>
            </v-card-text>
        </v-card>
        <br />
    </template>
    <v-card>
        <v-card-text>
            <v-alert v-if="missingFields.length > 0" type="error">
                All form fields must be filled out! Missing fields:
                <ul>
                    <li v-for="missingField of missingFields" class="ml-2">
                        (🐧) {{ missingField.id }}
                        <!-- ({{ missingField.id }}) -->
                    </li>
                </ul>
            </v-alert>

            <br />

            <ContentCopy :content="qrContent" label="QR Code Content" />

            <qr-code :contents="qrContent" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDebounce, useLocalStorage } from '@vueuse/core';
import ContentCopy from '@/components/ContentCopy.vue';
type Group = {
    id: 'prematch' | 'auton' | 'teleop' | 'endgame';
    header: string;
};

type FormField = {
    id: string;
    label: string;
    hint?: string;
    allowEmpty?: boolean;
    cols?: number;
    group: Group['id'];
} & (
    | {
          type: 'str' | 'num';
      }
    | {
          type: 'autocomplete';
          items: string[];
      }
    | {
          type: 'expansion-panel';
          contents: string,
      }
    | {
          type: 'select';
          options: string[];
      }
    | {
          type: 'btn-toggle';
          btnOpts: { value: string; color?: string }[];
      }
    | {
          type: 'checkbox';
          trueValue: string;
          falseValue: string;
      }
    | {
          type: 'charCount';
      }
    | {
          type: 'counter';
          min?: number;
          max?: number;
      }
);

const values = useLocalStorage<{
    [id: string]: string;
}>('idk', {});

const fields: FormField[] = [
    {
        id: 'teamNum',
        label: 'Team Number',
        type: 'num',
        group: 'prematch',
    },
    {
        id: 'matchNum',
        label: 'Match #',
        type: 'counter',
        group: 'prematch',
        min: 1,
        max: 80,
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
    // {
    //     id: 'teamNum',
    //     label: 'Team Number',
    //     type: 'autocomplete',
    //     items: teamItems,
    //     group: 'prematch',
    // },
    {
        id: 'startingPosition',
        label: 'Amp <Starting Position> Source',
        type: 'btn-toggle',
        btnOpts: [
            { value: '1', color: 'teal-accent-2' },
            { value: '2', color: 'teal-accent-2' },
            { value: '3', color: 'teal-accent-2' },
            { value: '4', color: 'teal-accent-2' },
            { value: '5', color: 'teal-accent-2' },
        ],
        group: 'auton',
    },
    {
        id: 'preloaded',
        label: 'Preloaded',
        type: 'checkbox',
        trueValue: '2',
        falseValue: '1',
        cols: 6,
        group: 'auton',
    },
    {
        id: 'leftZone',
        label: 'Left Zone',
        type: 'checkbox',
        trueValue: '2',
        falseValue: '1',
        cols: 6,
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
        id: 'wingPickupAuton',
        label: 'Wing Pickups',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'centerPickupAuton',
        label: 'Center Pickups',
        type: 'counter',
        group: 'auton',
    },
    {
        id: 'teleopAmp',
        label: 'Amp',
        type: 'counter',
        group: 'teleop',
    },
    {
        id: 'teleopSpeakerNA',
        label: 'Speaker (not amp.)',
        type: 'counter',
        group: 'teleop',
    },
    {
        id: 'teleopSpeakerAmp',
        label: 'Speaker (amplified)',
        type: 'counter',
        group: 'teleop',
    },
    {
        id: 'teleopTrap',
        label: 'Trap',
        type: 'counter',
        group: 'teleop',
        max: 3,
    },
    {
        id: 'stage',
        label: 'Stage',
        type: 'btn-toggle',
        btnOpts: [
            { value: 'none', color: 'teal-accent-2' },
            { value: 'park', color: 'teal-accent-2' },
            { value: 'alone', color: 'teal-accent-2' },
            { value: 'w/1', color: 'teal-accent-2' },
            { value: 'w/2', color: 'teal-accent-2' },
        ],
        group: 'endgame',
    },
    {
        id: 'pickupLocation',
        label: 'Pickup Location',
        type: 'btn-toggle',
        btnOpts: [
            { value: 'none', color: 'teal-accent-2' },
            { value: 'floor', color: 'teal-accent-2' },
            { value: 'source', color: 'teal-accent-2' },
            { value: 'both', color: 'teal-accent-2' },
        ],
        group: 'endgame',
    },
    {
        id: 'playStyle',
        label: 'Play Style',
        type: 'btn-toggle',
        btnOpts: [
            { value: 'none', color: 'teal-accent-2' },
            { value: 'offense', color: 'teal-accent-2' },
            { value: 'defense', color: 'teal-accent-2' },
            { value: 'both', color: 'teal-accent-2' },
        ],
        group: 'endgame',
    },
    {
        id: 'teleopBreakdown',
        label: 'Teleop Breakdowns',
        type: 'btn-toggle',
        btnOpts: [
            { value: 'no', color: 'teal-accent-2' },
            { value: 'half', color: 'teal-accent-2' },
            { value: 'yes', color: 'teal-accent-2' },
        ],
        group: 'endgame',
    },
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
];

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
function applyDefaultValues(v: typeof values) {
    const newValues = { ...values.value }; // clone
    for (const field of fields) {
        if (field.type === 'checkbox' && newValues[field.id] === undefined) {
            newValues[field.id] = field.falseValue;
        }
        if (field.type === 'counter' && newValues[field.id] === undefined) {
            newValues[field.id] = '0';
        }

        // Error messages

        if (field.id === 'startingPosition' && !newValues[field.id]) {
            newValues[field.id] = 'error';
        }

        if (field.id === 'teamNum' && !newValues[field.id]) {
            newValues[field.id] = 'error';
        }

        // Calculating the code here:

        if (field.id === 'teamNum') {
            newValues[field.id] = newValues[field.id] + '\t';
        }

        if (field.id === 'matchNum') {
            if (parseInt(newValues[field.id]) < 1 || !newValues[field.id]) {
                newValues[field.id] = 'error';
            } else if ((newValues[field.id] || '').length < 2) {
                newValues[field.id] = (newValues[field.id] || '').padStart(
                    2,
                    '0'
                );
            }
        }

        if (field.id === 'alliance') {
            if (newValues[field.id] === 'R1') {
                newValues[field.id] = '1';
            } else if (newValues[field.id] === 'R2') {
                newValues[field.id] = '2';
            } else if (newValues[field.id] === 'R3') {
                newValues[field.id] = '3';
            } else if (newValues[field.id] === 'B1') {
                newValues[field.id] = '4';
            } else if (newValues[field.id] === 'B2') {
                newValues[field.id] = '5';
            } else if (newValues[field.id] === 'B3') {
                newValues[field.id] = '6';
            } else {
                newValues[field.id] = 'error';
            }
        }

        if (field.id === 'stage') {
            if (newValues[field.id] === 'none') {
                newValues[field.id] = '1';
            } else if (newValues[field.id] === 'park') {
                newValues[field.id] = '2';
            } else if (newValues[field.id] === 'alone') {
                newValues[field.id] = '3';
            } else if (newValues[field.id] === 'w/1') {
                newValues[field.id] = '4';
            } else if (newValues[field.id] === 'w/2') {
                newValues[field.id] = '5';
            } else {
                newValues[field.id] = 'error';
            }
        }

        if (field.id === 'pickupLocation') {
            if (newValues[field.id] === 'none') {
                newValues[field.id] = '1';
            } else if (newValues[field.id] === 'floor') {
                newValues[field.id] = '2';
            } else if (newValues[field.id] === 'source') {
                newValues[field.id] = '3';
            } else if (newValues[field.id] === 'both') {
                newValues[field.id] = '4';
            } else {
                newValues[field.id] = 'error';
            }
        }

        if (field.id === 'playStyle') {
            if (newValues[field.id] === 'none') {
                newValues[field.id] = '1';
            } else if (newValues[field.id] === 'offense') {
                newValues[field.id] = '2';
            } else if (newValues[field.id] === 'defense') {
                newValues[field.id] = '3';
            } else if (newValues[field.id] === 'both') {
                newValues[field.id] = '4';
            } else {
                newValues[field.id] = 'error';
            }
        }

        if (field.id === 'teleopBreakdown') {
            if (newValues[field.id] === 'no') {
                newValues[field.id] = '1';
            } else if (newValues[field.id] === 'half') {
                newValues[field.id] = '2';
            } else if (newValues[field.id] === 'yes') {
                newValues[field.id] = '3';
            } else {
                newValues[field.id] = 'error';
            }
        }

        // Adding letters to values that could be double digits

        if (field.id === 'teleopAmp') {
            newValues[field.id] = 'a' + newValues[field.id] + 'b';
        }

        if (field.id === 'teleopSpeakerAmp') {
            newValues[field.id] = 'c' + newValues[field.id] + 'd';
        }

        // if (field.type === 'counter' && Number(newValues[field.id]) < 0) {
        //     newValues[field.id] = '0'
        // }
    }
    return newValues;
}

const debouncedValues = useDebounce(
    computed(() => applyDefaultValues(values)),
    500
);

const missingFields = computed(() => {
    return fields.filter(
        (field) =>
            debouncedValues.value[field.id] === 'error' ||
            debouncedValues.value[field.id] === 'error\t'
    );
});

const qrContent = computed(() => {
    // const valuesIguess = fieldsForValues.value.map(field => values.value[field.id]);
    // const valuesThatDefinitelyHaveStrings = valuesIguess.map(val => val || '');
    // const finalStringContent = valuesThatDefinitelyHaveStrings.join('\t')
    return fields
        .map((field) => {
            const fieldValue = debouncedValues.value[field.id] || '';
            return fieldValue;
        })
        .join('');
    // .join('\t') if we want to do tabs
});

function resetValues() {
    if (confirm('Are you sure you want to reset all values?')) {
        values.value = {
            // fields that don't reset
            // name: values.value.name,
            alliance: values.value.alliance,
            matchNum: values.value.matchNum,
        };
    }
}
</script>
