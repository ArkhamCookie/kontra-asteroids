import { kontra } from '../lib/kontra.mjs'

const { canvas, context } = kontra.init()

const asteroid = kontra.Sprite({
	type: 'asteroid',
	x: 100,
	y: 100,
	dx: Math.random() * 4 - 2,
	dy: Math.random() * 4 - 2,
	radius: 30,
	render() {
		this.context.strokeStyle = 'white'
		this.context.beginPath()
		this.context.arc(0, 0, this.radius, 0, Math.PI*2)
		this.context.stroke()
	}
})
asteroid.render()
