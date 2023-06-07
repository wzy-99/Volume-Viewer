<script setup>
import ImagePlane from './SlicePlane.vue';
import { ref, onMounted, watch } from 'vue';
import * as tf from '@tensorflow/tfjs';

const props = defineProps({
    array: {
        type: Object,
        required: true
    },
    
})
const emit = defineEmits(['xChanged', 'yChanged', 'zChanged']);

const mode = ref("sigmoid");

const scale = ref(1.0);

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
        // let max = x.max().dataSync();
        // let min = x.min().dataSync();
        // console.log(max, min);
        if (x.shape.length == 3) {
            if (mode.value === "sigmoid") {
                x = x.gather(channel.value, 2);
            } else if (mode.value === "rgb") {
                if (x.shape[2] !== 3) {
                    throw new Error('Invalid shape', x.shape);
                }
            }
        } else if (x.shape.length == 2) {
            // pass
        } else {
            throw new Error('Invalid shape', x.shape);
        }
        if (mode.value === "sigmoid") {
            if (scale.value !== 1.0) {
                x = x.mul(scale.value);
            }
            x = x.sigmoid().mul(255).toInt();
        } else if (mode.value === "rgb") {
            if (scale.value !== 1.0) {
                x = x.mul(scale.value);
            }
            x = x.mul(255).toInt();
        }
        return x
    });
}

const tensor2src = async (tensor) => {
    const canvas = document.createElement('canvas');
    return await tf.browser.toPixels(tensor, canvas).then(() => {
        return canvas.toDataURL();
    });
}

const onXChanged = (value) => {
    x.value = value;
    const tensor = gatherImage(0, value);
    tensor2src(tensor).then((src) => {
        xImage.value = src;
        tensor.dispose();
    });
}

const onYChanged = (value) => {
    y.value = value;
    const tensor = gatherImage(1, value);
    tensor2src(tensor).then((src) => {
        yImage.value = src;
        tensor.dispose();
    });
}

const onZChanged = (value) => {
    z.value = value;
    const tensor = gatherImage(2, value);
    tensor2src(tensor).then((src) => {
        zImage.value = src;
        tensor.dispose();
    });
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

watch(() => mode.value, () => {
    updateImage();
})

watch(() => scale.value, () => {
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
    <div class="flex justify-between content-center p-2 gap-2 hover:bg-base-200 rounded-md">
        <b class="text-primary">
            Mode:
        </b>
        <select v-model="mode">
            <option value="sigmoid">Sigmoid</option>
            <option value="rgb">RGB</option>
        </select>
    </div>
    <div class="flex justify-between content-center p-2 gap-2 hover:bg-base-200 rounded-md" v-if="tensor?.shape?.length == 4">
        <b class="text-primary">
            Channel:
        </b>
        <input type="number" class="w-16 border rounded-md"
        :min="minChannel" :max="maxChannel" v-model="channel" />
    </div>
    <div class="flex justify-between content-center p-2 gap-2 hover:bg-base-200 rounded-md">
        <b class="text-primary">
            Scale:
        </b>
        <input type="number" class="w-16 border rounded-md" v-model="scale" />
    </div>
    <div class="grid grid-cols-2 gap-2">
        <ImagePlane :image="xImage" :value="x" axis="x" @valueChanged="onXChanged" :min="x_min" :max="x_max" />
        <ImagePlane :image="yImage" :value="y" axis="y" @valueChanged="onYChanged" :min="y_min" :max="y_max" />
        <ImagePlane :image="zImage" :value="z" axis="z" @valueChanged="onZChanged" :min="z_min" :max="z_max" />
    </div>
</template>

<style scoped>

</style>
