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
];
</script>