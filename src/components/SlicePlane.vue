<script setup>
import { computed, watch, ref, defineEmits } from 'vue';

const props = defineProps({
    image: {
        type: Object,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    alt: {
        type: String,
        default: ''
    },
    axis: {
        type: String,
        default: 'x'
    }
})

const canvas = ref(null);

const emit = defineEmits(['valueChanged']);

const updateValue = (e) => {
    emit('valueChanged', Math.round(e.target.value));
}

const isImageValid = computed(() => {
    return props.image !== null;
})

const int32ToUInt8 = (int32) => {
    const uint8 = new Uint8ClampedArray(int32.length);
    for (let i = 0; i < int32.length; i++) {
        uint8[i] = int32[i];
    }
    return uint8;
}

const width = computed(() => {
    return props.image ? props.image.width : 0;
})

const height = computed(() => {
    return props.image ? props.image.height : 0;
})

const draw = () => {
    if (props.image) {
        const ctx = canvas.value.getContext('2d');
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        const imageData = ctx.createImageData(props.image.width, props.image.height);
        const data = int32ToUInt8(props.image.data);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0, 0, 0, props.image.width, props.image.height);
    }
}

watch(() => props.image, () => {
    draw();
})

</script>

<template>
    <div class="card bg-base-100 shadow-xl">
        <figure v-show="isImageValid" class="card-image">
            <canvas ref="canvas" :width="width" :height="height" />
        </figure>
        <div v-if="!isImageValid" class="alert shadow-lg alert-info ">
            <img src="Image_not_available.png" alt="Image not available" />
        </div>
        <div class="card-body">
            <div class="card-title">
                <h3>{{ axis }}</h3>
            </div>
            <input type="range" :min="min" :max="max" :value="value" class="range" @input="updateValue" />
        </div>
    </div>
</template>

<style scoped>

</style>
