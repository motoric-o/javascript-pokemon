import * as primitive from "../graphics/primitive/index.js";

export function createFillInfo(fillType, colors, coordinate, size = primitive.Vector2(0, 0)) {
    if (fillType != "FF" && fillType != "BF") {
        if (fillType != "R") {
            return { fillType: "FF", colors: colors, coords: coordinate };
        } else {
            return { fillType: "R", colors: colors, coords: coordinate, size: size };
        }
    }
    return { fillType: fillType, colors: colors, coords: coordinate };
}

export function getCentroid(points) {
    let x = 0;
    let y = 0;

    for (let point of points) {
        x += point.x;
        y += point.y;
    }

    return primitive.Vector2(Math.round(x / points.length), Math.round(y / points.length));
}

export function getScreenCentroid(w, h) {
    const points = [
        primitive.Vector2(0, 0),
        primitive.Vector2(w, 0),
        primitive.Vector2(w, h),
        primitive.Vector2(0, h)
    ];

    return getCentroid(points);
}

export function getFrame(x = 0, y = 0, w = 0, h = 0) {
    return {
        x: x,
        y: y,
        height: h,
        width: w
    }
}

// Use -1 at the end to loop the animation, use none to not make it loop
export function createAnimation(name, sequence, sequenceDirection = "C", framerate = 60) {
    return {
        name: name,
        sequence: sequence,
        sequenceDirection: sequenceDirection,
        framerate: framerate
    }
}

export function createShake(intensity = primitive.Vector2(0, 0), duration = 0, offset = primitive.Vector2(0, 0)) {
    return {
        intensity: intensity,
        timer: duration,
        offset: offset
    }
}

export function createTextAsset(text, options) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const defaults = {
        font: "sans-serif",
        size: 16,
        color: primitive.Color(0, 0, 0, 255),
        align: "left",
        baseline: "top"
    };

    const opts = { ...defaults, ...options };
    ctx.font = `${opts.size}px ${opts.font}`;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width);
    const height = Math.ceil(opts.size * 1.2);

    canvas.width = width;
    canvas.height = height;

    ctx.font = `${opts.size}px ${opts.font}`;
    ctx.fillStyle = `rgba(${opts.color.r}, ${opts.color.g}, ${opts.color.b}, ${opts.color.a / 255})`;
    ctx.textAlign = opts.align;
    ctx.textBaseline = opts.baseline;

    ctx.fillText(text, 0, 0);
    return {
        width: width,
        height: height,
        data: ctx.getImageData(0, 0, width, height).data
    };
}

export async function createAsset(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        img.onload = function (e) {
            const h = img.naturalHeight;
            const w = img.naturalWidth;

            const tempCanvas = document.createElement("canvas");
            tempCanvas.height = h;
            tempCanvas.width = w;
            
            const ctx = tempCanvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const asset = {
                height: h,
                width: w,
                data: ctx.getImageData(0, 0, w, h).data
            };

            resolve(asset);
        }

        img.onerror = function (e) {
            reject(new Error("Failed to load asset."));
        }
    })
}