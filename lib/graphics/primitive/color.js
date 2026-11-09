export function Color(r, g, b, a) {
    return {
        r: r,
        g: g,
        b: b,
        a: a !== undefined ? a : 255
    };
}

