class Geometry {

    constructor(A = 1, B = 1) {
        this.A = A
        this.B = B
    }

    rotate_inner_ring(theta, xs, ys) {
        if (xs.length !== ys.length) {
            console.log('length of xs and ys must be equal');
            return false
        }
        const xs_new = []
        const ys_new = []
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i]
            let y = ys[i]
            let r = Math.sqrt(x * x + y * y);
            let f = theta * this.A * this.A / (this.B * this.B - this.A * this.A) * (this.B * this.B / r - r)
            let x_y_new = this.rotate(f, x, y)
            xs_new.push(x_y_new.x)
            ys_new.push(x_y_new.y)
        }
        return {
            xs: xs_new,
            ys: ys_new
        }
    }

    rotate(theta, x, y) {
        // v_new = R*v, v = (x,y)^T, 
        // R = [[cos(theta) -sin(theta)], 
        //      [sin(theta) cos(theta)]]
        return {
            x: x * Math.cos(theta) - y * Math.sin(theta),
            y: x * Math.sin(theta) + y * Math.cos(theta)
        }
    }

    rotate_points(theta, xs, ys) {
        if (xs.length !== ys.length) {
            console.log('length of xs and ys must be equal');
            return false;
        }
        const xs_new = []
        const ys_new = []
        for (let i = 0; i < xs.length; i++) {
            let x_y_new = this.rotate(theta, xs[i], ys[i])
            xs_new.push(x_y_new.x)
            ys_new.push(x_y_new.y)
        }
        return {
            xs: xs_new,
            ys: ys_new
        }
    }

    static circ(N = 100, x0 = 0, y0 = 0, scale = 1) {
        let xs = [];
        let ys = [];
        for (let i = 0; i < N; i++) {
            xs.push(Math.cos(2 * Math.PI * i / N) * scale + x0);
            ys.push(Math.sin(2 * Math.PI * i / N) * scale + y0);
        }
        xs.push(xs[0])  // Complete the circle
        ys.push(ys[1])
        return {
            xs: xs,
            ys: ys
        }
    }

    static line(N = 100, x0, y0, x1, y1) {
        let xs = []
        let ys = []
        for (let i = 0; i < N; i++) {
            xs.push(x0 + (x1 - x0) * i / N)
            ys.push(y0 + (y1 - y0) * i / N)
        }
        return {
            xs: xs_new,
            ys: ys_new
        }
    }

}

