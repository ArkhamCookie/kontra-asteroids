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

for (let i = 0; i < 4; i++) {
	createAsteroid()
}

const loop = kontra.GameLoop({
	update() {
		sprites.map(sprite => {
			sprite.update()

			// Beyond left edge
			if (sprite.x < -sprite.radius) {
				sprite.x = canvas.width + sprite.radius
			}
			// Beyond right edge
			if (sprite.x > canvas.width + sprite.radius) {
				sprite.x = 0 - sprite.radius
			}
			// Beyond top edge
			if (sprite.y < -sprite.radius) {
				sprite.y = canvas.height + sprite.radius
			}
			// Beyond bottom edge
			if (sprite.y > canvas.height + sprite.radius) {
				sprite.y = -sprite.radius
			}
		})
	},
	render() {
		sprites.map(sprite => sprite.render())
	}
})
loop.start()
