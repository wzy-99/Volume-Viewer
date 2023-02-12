<script setup>
import Slicer from './components/Slicer.vue';
import Loader from './components/Loader.vue';
import { ref } from 'vue';

var array = ref(null);

const onArrayChanged = (value) => {
    array.value = value;
}

let theme = true;

// 切换主题
// 设置html的data-theme为light或drak
const onToggleChanged = () => {
    window.document.documentElement.setAttribute("data-theme",  theme ? "light" : "dark")
    theme = !theme;
}

</script>

<template>
    <div class="container mx-auto px-12 w-4/5">
        <div class="divider" />
        <Slicer :array="array" />
        <div class="divider" />
        <div class="flex justify-between content-center">
            <input type="checkbox" class="toggle" @change="onToggleChanged" :checked="theme" />
            <Loader class="" @arrayChanged="onArrayChanged" />
        </div>
    </div>
</template>

<style scoped>

</style>
