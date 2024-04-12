import { kontra } from '../lib/kontra.mjs'

const { canvas, context } = kontra.init()
let sprites = []

function createAsteroid() {
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
	sprites.push(asteroid)
}

const loop = kontra.GameLoop({
	update() {
		asteroid.update()

		// Beyond left edge
		if (asteroid.x < -asteroid.radius) {
			asteroid.x = canvas.width + asteroid.radius
		}
		// Beyond right edge
		if (asteroid.x > canvas.width + asteroid.radius) {
			asteroid.x = 0 - asteroid.radius
		}
		// Beyond top edge
		if (asteroid.y < -asteroid.radius) {
			asteroid.y = canvas.width + asteroid.radius
		}
		// Beyond bottom edge
		if (asteroid.y > canvas.width + asteroid.radius) {
			asteroid.y = -asteroid.radius
		}
	},
	render() {
		asteroid.render()
	}
})
loop.start()
