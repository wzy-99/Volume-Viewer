<script setup>
import Slicer from './components/Slicer.vue';
import Loader from './components/Loader.vue';
import { ref } from 'vue';

var array = ref(null);

const onArrayChanged = (value) => {
    array.value = value;
}

</script>

<template>
    <div class="artboard artboard-horizontal">
        <div class="divider" />
        <Slicer :array="array" />
        <div class="divider" />
        <div class="flex justify-end">
            <Loader class="" @arrayChanged="onArrayChanged" />
        </div>
    </div>
</template>

<style scoped>

</style>
