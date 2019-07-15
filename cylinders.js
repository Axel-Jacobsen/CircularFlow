'use strict'

class Geometry {

    constructor(A = 1, B = 1) {
        this.A = A;
        this.B = B;
    }

    rotate_inner_ring(theta, xs, ys) {
        if (xs.length !== ys.length) {
            console.log('length of xs and ys must be equal');
            return false;
        }
        const xs_new = [];
        const ys_new = [];
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let y = ys[i];
            let r = Math.sqrt(x * x + y * y);
            let f = theta * this.A * this.A / (this.B * this.B - this.A * this.A) * (this.B * this.B / r - r);
            let x_y_new = this.rotate(f, x, y)
            xs_new.push(x_y_new[0])
            ys_new.push(x_y_new[1])
        }
        return [xs_new, ys_new];
    }

    rotate(theta, x, y) {
        // v_new = R*v, v = (x,y)^T, 
        // R = [[cos(theta) -sin(theta)], 
        //      [sin(theta) cos(theta)]]
        let x_new = x * Math.cos(theta) - y * Math.sin(theta);
        let y_new = x * Math.sin(theta) + y * Math.cos(theta);
        return [x_new, y_new]
    }

    rotate_points(theta, xs, ys) {
        if (xs.length !== ys.length) {
            console.log('length of xs and ys must be equal');
            return false;
        }
        const xs_new = [];
        const ys_new = [];
        for (let i = 0; i < xs.length; i++) {
            let x_y_new = this.rotate(theta, xs[i], ys[i])
            xs_new.push(x_y_new[0]);
            ys_new.push(x_y_new[1]);
        }
        return [xs_new, ys_new];
    }

    circ(N = 100, x0 = 0, y0 = 0, scale = 1) {
        let xs = [];
        let ys = [];
        for (let i = 0; i < N; i++) {
            xs.push(Math.cos(2 * Math.PI * i / N) * scale + x0);
            ys.push(Math.sin(2 * Math.PI * i / N) * scale + y0);
        }
        // Complete the circle
        xs.push(xs[0])
        ys.push(ys[0])
        return [xs, ys];
    }

    line(N = 100, x0, y0, x1, y1) {
        let xs = []
        let ys = []
        for (let i = 0; i < N; i++) {
            xs.push(x0 + (x1 - x0) * i / N)
            ys.push(y0 + (y1 - y0) * i / N)
        }
        return [xs, ys]
    }
}

class Transform {

    static joukowsky(xs, ys, lambda) {
        const ws = []
        const xs_new = []
        const ys_new = []
        for (let i = 0; i < xs.length; i++) {
            let z = math.complex(xs[i], ys[i])
            let w = math.add(z, math.divide(lambda * lambda, z))
            console.log(i, z, w);

            xs_new.push(math.re(w))
            ys_new.push(math.im(w))
        }
        return [xs_new, ys_new]
    }

}

const A = 2  // Inner radius
const B = 10 // Outer radius
let THETA = 0 // Angle of rotation of inner radius

const get_rotated_ring = () => {
    const geo = new Geometry(A, B)
    let shape = geo.circ(1000, 3, 3)
    let rotated_circle = geo.rotate_inner_ring(THETA, shape[0], shape[1])
    return {
        x: rotated_circle[0],
        y: rotated_circle[1],
        type: 'markers'
    }
}

const get_airfoil_data = () => {
    const geo = new Geometry()
    const r = 1.13
    const x_off = 0.1
    const y_off = 0
    const circle = geo.circ(1000, x_off, y_off, r)
    const airfoil = Transform.joukowsky(circle[0], circle[1], r - math.sqrt(x_off * x_off + y_off * y_off))
    return [{
        x: circle[0],
        y: circle[1],
        type: 'markers'
    },
    {
        x: airfoil[0],
        y: airfoil[1],
        type: 'markers'
    }]
}

// Get Taylor-Couette Data
const get_tc_data = () => {
    const geo = new Geometry(A, B)
    let shape = geo.circ(100, 3, 3)

    const inner_circle = {
        x: geo.circ(100, 0, 0, A)[0],
        y: geo.circ(100, 0, 0, A)[1]
    }

    const outer_circle = {
        x: geo.circ(100, 0, 0, B)[0],
        y: geo.circ(100, 0, 0, B)[1]
    }

    const r0 = {
        x: shape[0],
        y: shape[1]
    }

    const r_rotated = get_rotated_ring()

    return [inner_circle, outer_circle, r0, r_rotated]
}

const TaylorCouetteData = get_tc_data()
const AirfoilData = get_airfoil_data()

const layout = {
    autosize: true,
    width: 600,
    height: 600,
    showlegend: false,
    paper_bgcolor: '#f0f0f0',
    plot_bgcolor: '#f0f0f0',
    hovermode: false,
    xaxis: {
        constrain: 'domain',
        range: [-11, 11]
    },
    yaxis: {
        scaleanchor: 'x',
        range: [-11, 11]
    }
}

document.onkeypress = e => {

    e = e || window.event

    if (e.key === 'j') {
        THETA = THETA + 0.1
    } else if (e.key === 'k') {
        THETA = THETA - 0.1
    } else if (e.key === 'l') {
        THETA = 0
    } else {
        return
    }

    let div = document.getElementById('theta');
    div.innerHTML = '&Theta; = ' + THETA.toFixed(1) + ' radians'

    TaylorCouetteData[3] = get_rotated_ring()

    Plotly.redraw('taylorcouette')
}

Plotly.newPlot('airfoil', AirfoilData, layout, { 'displayModeBar': false })
Plotly.newPlot('taylorcouette', TaylorCouetteData, layout, { 'displayModeBar': false })

