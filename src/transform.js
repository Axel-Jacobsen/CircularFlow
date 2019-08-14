class Transform {

    static joukowsky(xs, ys, lambda) {
        const xs_new = []
        const ys_new = []
        for (let i = 0; i < xs.length; i++) {
            let z = math.complex(xs[i], ys[i])
            let w = math.add(z, math.divide(lambda * lambda, z))
            xs_new.push(math.re(w))
            ys_new.push(math.im(w))
        }
        return {
            xs: xs_new,
            ys: ys_new
        }
    }

}

