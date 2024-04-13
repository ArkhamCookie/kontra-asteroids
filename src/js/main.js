import { kontra } from '../lib/kontra.mjs'

const { canvas, context } = kontra.init()
const sprites = []

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
			this.context.arc(0, 0, this.radius, 0, Math.PI * 2)
			this.context.stroke()
		}
	})
	sprites.push(asteroid)
}

for (let i = 0; i < 4; i++) {
	createAsteroid()
}

kontra.initKeys()

const ship = kontra.Sprite({
	x: 300,
	y: 300,
	radius: 6,
	render() {
		this.context.strokeStyle = 'white'
		this.context.beginPath()
		this.context.moveTo(-3, -5)
		this.context.lineTo(12, 0)
		this.context.lineTo(-3, 5)
		this.context.closePath()
		this.context.stroke()
	},
	update() {
		if (kontra.keyPressed('arrowleft')) {
			this.rotation += kontra.degToRad(-4)
		} else if (kontra.keyPressed('arrowright')) {
			this.rotation += kontra.degToRad(4)
		}

		const cos = Math.cos(this.rotation)
		const sin = Math.sin(this.rotation)

		// TODO: Improve breaking
		if (kontra.keyPressed('arrowup')) {
			this.ddx = cos * 0.05
			this.ddy = sin * 0.05
		} else {
			this.ddx = 0
			this.ddy = 0
		}
		this.advance()

		if (this.velocity.length() > 5) {
			this.dx *= 0.95
			this.dy *= 0.95
		}
	}
})
sprites.push(ship)

const loop = kontra.GameLoop({
	update() {
		// eslint-disable-next-line array-callback-return
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
