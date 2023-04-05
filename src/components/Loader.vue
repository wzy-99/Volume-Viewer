<script setup>
import npyjs from '../scripts/npyjs.js';

const npy = new npyjs();

const emit = defineEmits(['arrayChanged']);

const onFileChanged = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const arrayBufferContents = e.target.result;
        let array = npy.parse(arrayBufferContents);
        emit('arrayChanged', array);
        console.log('load:', array.shape, array.data.length);
    }
    reader.readAsArrayBuffer(e.target.files[0]);
}

</script>

<template>
    <input type="file" class="file-input w-full max-w-xs" @change="onFileChanged" />
</template>

<style scoped>

</style>
