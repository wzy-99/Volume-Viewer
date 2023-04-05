<script setup>
import { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import { computed, watch, ref, defineEmits, toRaw } from 'vue';
import { Panzoom } from "@fancyapps/ui/dist/panzoom/panzoom.esm.js";

const props = defineProps({
    image: {
        type: Tensor,
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

const src = ref('');
const panzoom = ref(null);

var flip_horizontal = ref(true);
var flip_vertical = ref(true);

const emit = defineEmits(['valueChanged']);

const updateValue = (e) => {
    emit('valueChanged', Math.round(e.target.value));
}

const isImageValid = computed(() => {
    return props.image !== null;
})

const width = computed(() => {
    return props.image ? props.image.shape[1] : 0;
})

const height = computed(() => {
    return props.image ? props.image.shape[2] : 0;
})

const draw = () => {
    if (props.image) {
        let image = toRaw(props.image);
        if (flip_horizontal.value) {
            let origin = image;
            image = origin.reverse(1);
            origin.dispose();
        }
        if (flip_vertical.value) {
            let origin = image;
            image = origin.reverse(0);
            origin.dispose();
        }
        // const ctx = canvas.value.getContext('2d');
        // ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        const canvas = document.createElement('canvas');
        tf.browser.toPixels(image, canvas).then(() => {
            src.value = canvas.toDataURL();
            new Panzoom(panzoom.value);
            tf.dispose(image);
        });
        console.log('memory used: ' + tf.memory().numBytes,
            'numTensors: ' + tf.memory().numTensors,
            'unreliable: ' + tf.memory().unreliable,
        );
    }
}

watch(() => props.image, () => {
    draw();
})

watch(() => flip_horizontal.value, () => {
    draw();
})

watch(() => flip_vertical.value, () => {
    draw();
})

</script>

<template>
    <div class="card bg-base-100 shadow">
        <div v-if="isImageValid" class="f-panzoom alert border-2 border-dashed
         border-base-300" id="myPanzoom" ref="panzoom">
            <img class="f-panzoom__content" :src="src" />
        </div>
        <div v-if="!isImageValid" class="alert shadow-lg alert-info">
            <img src="Image_not_available.png" alt="Image not available" class="" />
        </div>
        <div class="card-body">
            <div class="card-title">
                <h3>{{ axis }}</h3>
            </div>
            <input type="range" :min="min" :max="max" :value="value" class="range" @input="updateValue" />
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Horizontal flip</span>
                    <input type="checkbox" class="toggle" :checked="flip_horizontal" @change="flip_horizontal = !flip_horizontal" />
                </label>
                <label class="label cursor-pointer">
                    <span class="label-text">Vertical flip</span>
                    <input type="checkbox" class="toggle" :checked="flip_vertical" @change="flip_vertical = !flip_vertical" />
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
