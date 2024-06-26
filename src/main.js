import { kontra } from './lib/kontra.mjs'

const { canvas } = kontra.init()
let sprites = []

function createAsteroid(x, y, radius) {
	const asteroid = kontra.Sprite({
		type: 'asteroid',
		x,
		y,
		dx: Math.random() * 4 - 2,
		dy: Math.random() * 4 - 2,
		radius,
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
	createAsteroid(100, 100, 30)
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

		// TODO: Only allow player to shoot every 4 seconds
		if (kontra.keyPressed('space')) {
			const bullet = kontra.Sprite({
				color: 'white',
				x: this.x + cos * 12,
				y: this.y + sin * 12,
				dx: this.dx + cos * 5,
				dy: this.dy + sin * 5,
				ttl: 50,
				radius: 2,
				width: 2,
				height: 2
			})
			sprites.push(bullet)
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

			// Collision detection
			for (let i = 0; i < sprites.length; i++) {
				// Only check for collision against asteroids
				if (sprites[i].type === 'asteroid') {
					// Don't check asteroid vs asteroid collisions
					for (let j = 0; j < sprites.length; j++) {
						if (sprites[j].type !== 'asteroid') {
							const asteroid = sprites[i]
							const sprite = sprites[j]
							const dx = asteroid.x - sprite.x
							const dy = asteroid.y - sprite.y

							if (Math.hypot(dx, dy) < asteroid.radius + sprite.radius) {
								asteroid.ttl = 0
								sprite.ttl = 0

								if (asteroid.radius > 10) {
									for (let x = 0; x < 3; x++) {
										createAsteroid(asteroid.x, asteroid.y, asteroid.radius / 2.5)
									}
								}
								break
							}
						}
					}
				}
			} sprites = sprites.filter(sprite => sprite.isAlive())
		})
	},
	render() {
		sprites.map(sprite => sprite.render())
	}
})
loop.start()
