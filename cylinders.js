const A = 2
const B = 10
let THETA = 0

const position_on_rotation = (theta, xs, ys) => {
    if (xs.length !== ys.length) {
        console.log('length of xs and ys must be equal');
        return false
    }

    const xs_new = []
    const ys_new = []

    for (let i = 0; i < xs.length; i++) {
        let x = xs[i]
        let y = ys[i]
        let r = Math.sqrt(x * x + y * y)
        let f = theta * A * A / (B * B - A * A) * (B * B / r - r)

        xs_new.push(-Math.sin(theta) * f + x)
        ys_new.push(Math.cos(theta) * f + y)
    }

    return [xs_new, ys_new]
}

const circ = (N, x0 = 0, y0 = 0, scale = 1) => {
    let xs = []
    let ys = []

    for (let i = 0; i < N; i++) {
        xs.push(Math.cos(2 * Math.PI * i / N) * scale + x0)
        ys.push(Math.sin(2 * Math.PI * i / N) * scale + y0)
    }

    return [xs, ys]
}

const get_data = () => {
    let circle = circ(1000, 3, 3)
    let rotated_circle = position_on_rotation(THETA, circle[0], circle[1])

    const r_rotated = {
        x: rotated_circle[0],
        y: rotated_circle[1],
        type: 'markers'
    }

    const r0 = {
        x: circle[0],
        y: circle[1]
    }

    const inner_circle = {
        x: circ(100, 0, 0, A)[0],
        y: circ(100, 0, 0, A)[1]
    }

    const outer_circle = {
        x: circ(100, 0, 0, B)[0],
        y: circ(100, 0, 0, B)[1]
    }

    return [r0, inner_circle, outer_circle, r_rotated]
}

let DATA = get_data()

const layout = {
    autosize: true,
    width: 600,
    height: 600,
    show_legend: false,
    xaxis: {
        constrain: 'domain',
        range: [-11, 11]
    },
    yaxis: {
        scaleanchor: 'x',
        range: [-11, 11]
    }
}

document.onkeypress = function (e) {

    e = e || window.event;

    // u = 117, d = 100
    if (e.keyCode === 117) {
        THETA = THETA + 0.1
    }
    if (e.keyCode === 100) {
        THETA = THETA - 0.1
    }

    let div = document.getElementById('theta');
    div.innerHTML = THETA;

    DATA[3] = {
        x: get_data()[3].x,
        y: get_data()[3].y
    }
    console.log(DATA);
    
    Plotly.redraw('chart')
};

Plotly.newPlot('chart', DATA, layout)