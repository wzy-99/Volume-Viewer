class Volume {
    constructor(opts) {
        if (!opts) {
            throw new Error("No options provided");
        }
        if (!opts.shape) {
            throw new Error("No shape provided");
        }
        if (!opts.dtype) {
            throw new Error("No dtype provided");
        }
        if (!opts.data) {
            throw new Error("No data provided");
        }
        this.shape = opts.shape;
        this.dtype = opts.dtype;
        this.data = opts.data;
    }

    get(x, y, z) {
        return Math.round(this.data[x + y * this.shape[0] + z * this.shape[0] * this.shape[1]] * 255)
    }

    slice(axis, v) {
        if (axis === "x") {
            let slice = new Uint8ClampedArray(this.shape[1] * this.shape[2] * 4);
            for (let y = 0; y < this.shape[1]; y++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    slice[(y + z * this.shape[1]) * 4] = this.get(v, y, z);
                    slice[(y + z * this.shape[1]) * 4 + 1] = this.get(v, y, z);
                    slice[(y + z * this.shape[1]) * 4 + 2] = this.get(v, y, z);
                    slice[(y + z * this.shape[1]) * 4 + 3] = 255;
                }
            }
            return slice;
        } else if (axis === "y") {
            let slice = new Uint8ClampedArray(this.shape[0] * this.shape[2] * 4);
            for (let x = 0; x < this.shape[0]; x++) {
                for (let z = 0; z < this.shape[2]; z++) {
                    slice[(x + z * this.shape[0]) * 4] = this.get(x, v, z);
                    slice[(x + z * this.shape[0]) * 4 + 1] = this.get(x, v, z);
                    slice[(x + z * this.shape[0]) * 4 + 2] = this.get(x, v, z);
                    slice[(x + z * this.shape[0]) * 4 + 3] = 255;
                }
            }
            return slice;
        } else if (axis === "z") {
            let slice = new Uint8ClampedArray(this.shape[0] * this.shape[1] * 4);
            for (let x = 0; x < this.shape[0]; x++) {
                for (let y = 0; y < this.shape[1]; y++) {
                    slice[(x + y * this.shape[0]) * 4] = this.get(x, y, v);
                    slice[(x + y * this.shape[0]) * 4 + 1] = this.get(x, y, v);
                    slice[(x + y * this.shape[0]) * 4 + 2] = this.get(x, y, v);
                    slice[(x + y * this.shape[0]) * 4 + 3] = 255;
                }
            }
            return slice;
        } else {
            throw new Error("Invalid axis");
        }
    }
}

export default Volume;