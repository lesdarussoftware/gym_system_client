export function getNumberInputAbsValue(value: number, min: number, max: number): number {
    if (Math.abs(value) < min) return min;
    if (Math.abs(value) > max) return max;
    return Math.abs(value);
}