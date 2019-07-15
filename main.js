'use strict'

// `transform.js` and `geometry.js` are included before this in `index.html`

const get_airfoil_data = () => {
    const geo = new Geometry()
    const r = 1.13
    const x_off = 0.1
    const y_off = 0
    const circle = geo.circ(1000, x_off, y_off, r)
    const airfoil = Transform.joukowsky(circle.xs, circle.ys, r - math.sqrt(x_off * x_off + y_off * y_off))
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

const A = 2  // Inner radius
const B = 10 // Outer radius
let THETA = 0 // Angle of rotation of inner radius

const get_rotated_ring = () => {
    const geo = new Geometry(A, B)
    let shape = geo.circ(1000, 3, 3)
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
    let shape = geo.circ(100, 3, 3)

    const inner_circle = {
        x: geo.circ(100, 0, 0, A).xs,
        y: geo.circ(100, 0, 0, A).ys
    }

    const outer_circle = {
        x: geo.circ(100, 0, 0, B).xs,
        y: geo.circ(100, 0, 0, B).ys
    }

    const r0 = {
        x: shape.xs,
        y: shape.ys
    }

    const r_rotated = get_rotated_ring()

    return [inner_circle, outer_circle, r0, r_rotated]
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

const AirfoilData = get_airfoil_data()
const TaylorCouetteData = get_tc_data()

Plotly.newPlot('airfoil', AirfoilData, layout, { 'displayModeBar': false })
Plotly.newPlot('taylorcouette', TaylorCouetteData, layout, { 'displayModeBar': false })

