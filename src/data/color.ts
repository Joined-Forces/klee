export class Color {

    public R: number;
    public G: number;
    public B: number;
    public A: number;

    constructor(value: string | number, ...params : number[]) {
        if (typeof value == "string") {
            this.initializeFromString(value);
        }
        else if (typeof value == "number" && params.length >= 2) 
        {
            params.unshift(value);
            this.initializeFromComponentValues(params);
        }

    }

    initializeFromString(colorString: string): void {
        if (colorString.startsWith('#')) {
            this.R = Number.parseInt(colorString.substr(1, 2), 16);
            this.G = Number.parseInt(colorString.substr(3, 2), 16);
            this.B = Number.parseInt(colorString.substr(5, 2), 16);
            this.A = 1;

            if (colorString.length >= 9) {
                this.A = Number.parseInt(colorString.substr(7, 2), 16);
            }
        } else if (colorString.startsWith('rgb')) {
            let withAlpha = colorString.startsWith('rgba');

            colorString = colorString.replace(/[rgba()]/g, '');
            let components = colorString.split(',');

            this.R = Number.parseInt(components[0]);
            this.G = Number.parseInt(components[1]);
            this.B = Number.parseInt(components[2]);
            this.A = 1;

            if (withAlpha) {
                this.A = Number.parseFloat(components[3]);
            }
        }
    }

    initializeFromComponentValues(values: number[]): void {
        this.R = values[0];
        this.G = values[1];
        this.B = values[2];
        this.A = 1;

        if (values.length > 3)
            this.A = values[3];
    }

    applyGamma() {
        this.R = Math.floor(Math.min(1, Math.max(0, Math.pow(this.R / 255.0, 1/2.2))) * 255);
        this.G = Math.floor(Math.min(1, Math.max(0, Math.pow(this.G / 255.0, 1/2.2))) * 255);
        this.B = Math.floor(Math.min(1, Math.max(0, Math.pow(this.B / 255.0, 1/2.2))) * 255);
    }

    darken(value: number) {
        value = 1 - value;
        this.R = this.R * value;
        this.G = this.G * value;
        this.B = this.B * value;
    }

    toRGBString() {
        let components = [this.R, this.G, this.B];
        return 'rgb(' + components.join(',') + ')';
    }

    toRGBAString() {
        let components = [this.R, this.G, this.B, this.A];
        return 'rgba(' + components.join(',') + ')';
    }

    toHexString() {
        let hex = "#";
        hex = ("0" + this.R.toString(16)).slice(-2)
            + ("0" + this.G.toString(16)).slice(-2)
            + ("0" + this.B.toString(16)).slice(-2);
        return hex;
    }

    toHexWithAlphaString() {
        let hex = "#";
        hex = ("0" + this.R.toString(16)).slice(-2)
            + ("0" + this.G.toString(16)).slice(-2)
            + ("0" + this.B.toString(16)).slice(-2)
            + ("0" + this.A.toString(16)).slice(-2);
        return hex;
    }
}