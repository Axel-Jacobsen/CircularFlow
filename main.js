'use strict'

// `transform.js` and `geometry.js` are included before this in `index.html`
let X_OFF = 0.1
let Y_OFF = 0

const get_airfoil_data = () => {
    const r = 1.13
    const circle = Geometry.circ(1000, X_OFF, Y_OFF, r)
    const airfoil = Transform.joukowsky(circle.xs, circle.ys, r - math.sqrt(X_OFF * X_OFF + Y_OFF * Y_OFF))

    return [{
        x: circle.xs,
        y: circle.ys,
        type: 'markers'
    },
    {
        x: airfoil.xs,
        y: airfoil.ys,
        type: 'markers'
    }]
}

const A = 1  // Inner radius
const B = 4 // Outer radius
let THETA = 0 // Angle of rotation of inner radius

const get_rotated_ring = () => {
    const geo = new Geometry(A, B)
    let shape = Geometry.circ(1000, 1.5, 1.5, 0.5)
    let rotated_circle = geo.rotate_inner_ring(THETA, shape.xs, shape.ys)
    return {
        x: rotated_circle.xs,
        y: rotated_circle.ys,
        type: 'markers'
    }
}

// Get Taylor-Couette Data
const get_tc_data = () => {
    const geo = new Geometry(A, B)

    const inner_circle = {
        x: Geometry.circ(100, 0, 0, A).xs,
        y: Geometry.circ(100, 0, 0, A).ys
    }

    const outer_circle = {
        x: Geometry.circ(100, 0, 0, B).xs,
        y: Geometry.circ(100, 0, 0, B).ys
    }

    const r_rotated = get_rotated_ring()

    return [inner_circle, outer_circle, r_rotated]
}

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
        range: [-5, 5]
    },
    yaxis: {
        scaleanchor: 'x',
        range: [-5, 5]
    }
}

document.onkeypress = e => {

    e = e || window.event

    switch (e.key) {
        // Airfoil
        case 'w':
            Y_OFF = Y_OFF + 0.1
            break
        case 'a':
            X_OFF = X_OFF - 0.1
            break
        case 's':
            Y_OFF = Y_OFF - 0.1
            break
        case 'd':
            X_OFF = X_OFF + 0.1
            break
        case 'r':
            X_OFF = 0.1
            Y_OFF = 0
            break
        // Taylor-Couette
        case 'j':
            THETA = THETA + 0.1
            break
        case 'k':
            THETA = THETA - 0.1
            break
        case 'l':
            THETA = 0
            break
        default:
            return
    }

    let div1 = document.getElementById('x_off');
    div1.innerHTML = 'x0 = ' + X_OFF.toFixed(1)

    let div2 = document.getElementById('y_off');
    div2.innerHTML = 'y0 = ' + Y_OFF.toFixed(1)

    let div3 = document.getElementById('theta');
    div3.innerHTML = '&Theta; = ' + THETA.toFixed(1) + ' radians'

    const fresh_data = get_airfoil_data()
    AirfoilData[0] = fresh_data[0]
    AirfoilData[1] = fresh_data[1]
    TaylorCouetteData[2] = get_rotated_ring()

    Plotly.redraw('airfoil')
    Plotly.redraw('taylorcouette')
}

const AirfoilData = get_airfoil_data()
const TaylorCouetteData = get_tc_data()

Plotly.newPlot('airfoil', AirfoilData, layout, { 'displayModeBar': false })
Plotly.newPlot('taylorcouette', TaylorCouetteData, layout, { 'displayModeBar': false })

