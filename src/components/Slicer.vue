<script setup>
import ImagePlane from './SlicePlane.vue';
import { ref, onMounted, watch } from 'vue';
import * as tf from '@tensorflow/tfjs';

const props = defineProps({
    array: {
        type: Object,
        required: true
    },
    isSigmoided: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['xChanged', 'yChanged', 'zChanged']);

var tensor = null;

var x = ref(0);
var y = ref(0);
var z = ref(0);

var x_min = ref(0);
var y_min = ref(0);
var z_min = ref(0);

var x_max = ref(0);
var y_max = ref(0);
var z_max = ref(0);

var xImage = ref(null);
var yImage = ref(null);
var zImage = ref(null);

const toImageData = (tensor) => {
    // 1. tensor * 255 to int32
    if (!props.isSigmoided) {
        tensor = tf.tidy(() => {
            return tensor.sigmoid().sub(0.5).mul(255*2).toInt();
        });

    } else {
        tf.tidy(() => {
            tensor = tensor.mul(255).toInt();
        });
    }
    return tensor;
}

const updateXImage = () => {
    let data = tensor.gather(x.value, 0)
    xImage.value = toImageData(data);
    data.dispose();
}

const onXChanged = (value) => {
    emit('xChanged', value);
    x.value = value;
    updateXImage();
}

const updateYImage = () => {
    let data = tensor.gather(y.value, 1)
    yImage.value = toImageData(data);
    data.dispose();
}

const onYChanged = (value) => {
    emit('yChanged', value);
    y.value = value;
    updateYImage();
}

const updateZImage = () => {
    let data = tensor.gather(z.value, 2)
    zImage.value = toImageData(data);
    data.dispose();
}

const onZChanged = (value) => {
    emit('zChanged', value);
    z.value = value;
    updateZImage();
}

const updateImage = () => {
    updateXImage();
    updateYImage();
    updateZImage();
}

const update = () => {
    tensor = tf.tensor(props.array.data, props.array.shape);
    x_min.value = 0;
    y_min.value = 0;
    z_min.value = 0;
    x_max.value = tensor.shape[0] - 1;
    y_max.value = tensor.shape[1] - 1;
    z_max.value = tensor.shape[2] - 1;
    x.value = tensor.shape[0] / 2;
    y.value = tensor.shape[1] / 2;
    z.value = tensor.shape[2] / 2;
    updateImage();
}

onMounted(() => {
    if (props.array) {
        update();
    }
})

watch(() => props.array, () => {
    if (props.array) {
        update();
    }
})


</script>

<template>
    <div class="grid grid-cols-2 gap-2">
        <ImagePlane :image="xImage" :value="x" axis="x" @valueChanged="onXChanged" :min="x_min" :max="x_max" />
        <ImagePlane :image="yImage" :value="y" axis="y" @valueChanged="onYChanged" :min="y_min" :max="y_max" />
        <ImagePlane :image="zImage" :value="z" axis="z" @valueChanged="onZChanged" :min="z_min" :max="z_max" />
    </div>
</template>

<style scoped>

</style>
