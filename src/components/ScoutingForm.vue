<template>
    <template v-for="field of fields">
        <v-text-field
            v-if="field.type === 'num'"
            :label="field.label"
            type="number"
        />
        <v-text-field
            v-else-if="field.type === 'str'"
            :label="field.label"
        />
        <v-select
            v-else-if="field.type === 'select'"
            :label="field.label"
            :items="field.options || []"    
        />
    </template>
</template>

<script setup lang="ts">
type FormField = {
    id: string;
    label: string;
    type: 'str' | 'num' | 'select';
    options?: string[]; // only if `type: 'select'`
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
        label: 'Amp: S score | M miss',
        type: 'str',
    },
    {
        id: 'speakerAuton',
        label: 'Speaker: S score | M miss',
        type: 'str',
    },
    {
        id: 'wingPickupAuton',
        label: 'Speaker: S score | M miss',
        type: 'str',
    },
    {
        id: 'autonBreakdown',
        label: 'Auton Breakdown',
        type: 'select',
        options: ['yes', 'no'],
    },
    {
        id: 'teleopAmp',
        label: 'Amp',
        type: 'str',
    },
    {
        id: 'teleopSpeaker',
        label: 'Speaker: N not amplified | A amplified',
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
</script>