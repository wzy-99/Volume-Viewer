<script setup>
import ImagePlane from './SlicePlane.vue';
import { ref, onMounted, watch } from 'vue';
import * as tf from '@tensorflow/tfjs';

const props = defineProps({
    array: {
        type: Object,
        required: true
    },
    nomalMode: {
        type: String,
        default: "sigmoid"
    }
})
const emit = defineEmits(['xChanged', 'yChanged', 'zChanged']);

var tensor = null;

var channel = ref(0);
var maxChannel = ref(0);
var minChannel = ref(0);

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

const gatherImage = (axis, value) => {
    return tf.tidy(() => {
        let x = tensor.gather(value, axis);
        if (x.shape.length == 3) {
            x = x.gather(channel.value, 2);
        } else if (x.shape.length == 2) {
            // pass
        } else {
            throw new Error('Invalid shape', x.shape);
        }
        if (props.nomalMode === "sigmoid") {
            x = x.sigmoid().mul(255).toInt();
        } else if (props.nomalMode === "none") {
            x = x.mul(255).toInt();
        }
        return x
    });
}

const onXChanged = (value) => {
    if (value) {
        x.value = value;
    }
    xImage.value?.dispose();
    xImage.value = gatherImage(0, value);
}

const onYChanged = (value) => {
    if (value) {
        y.value = value;
    }
    yImage.value?.dispose();
    yImage.value = gatherImage(1, value);
}

const onZChanged = (value) => {
    if (value) {
        z.value = value;
    }
    zImage.value?.dispose();
    zImage.value = gatherImage(2, value);
}

const updateImage = () => {
    onXChanged(x.value);
    onYChanged(y.value);
    onZChanged(z.value);
}

const update = () => {
    tensor = tf.tensor(props.array.data, props.array.shape);
    x_min.value = 0;
    y_min.value = 0;
    z_min.value = 0;
    x_max.value = tensor.shape[0] - 1;
    y_max.value = tensor.shape[1] - 1;
    z_max.value = tensor.shape[2] - 1;
    x.value = Math.floor(tensor.shape[0] / 2);
    y.value = Math.floor(tensor.shape[1] / 2);
    z.value = Math.floor(tensor.shape[2] / 2);
    if (tensor.shape.length == 4) {
        maxChannel.value = tensor.shape[3] - 1;
        minChannel.value = 0;
        channel.value = 0;
    }
    updateImage();
}

watch(() => channel.value, () => {
    updateImage();
})

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
    <div class="flex justify-between content-center p-2 gap-2 hover:bg-base-200 rounded-md
    " v-if="tensor?.shape?.length == 4">
        <b class="text-primary">
            Channel:
        </b>
        <input type="number" class="w-16 border rounded-md"
        :min="minChannel" :max="maxChannel" v-model="channel" />
    </div>
    <div class="grid grid-cols-2 gap-2">
        <ImagePlane :image="xImage" :value="x" axis="x" @valueChanged="onXChanged" :min="x_min" :max="x_max" />
        <ImagePlane :image="yImage" :value="y" axis="y" @valueChanged="onYChanged" :min="y_min" :max="y_max" />
        <ImagePlane :image="zImage" :value="z" axis="z" @valueChanged="onZChanged" :min="z_min" :max="z_max" />
    </div>
</template>

<style scoped>

</style>
