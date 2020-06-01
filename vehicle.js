class Vehicle {
	constructor(game, laneIndex) {
		this.game = game;
		this.laneIndex = laneIndex;
		this.applyRandomType();
		this.x = 0;
		this.y = 0;
		this.direction = 'RIGHT';
		this.speed = 3;
		this.y = calcCenter(
			{
				x: 0,
				y: laneIndex * game.blockSize,
				w: game.blockSize,
				h: game.blockSize
			},
			this
		).y;
	}

	applyRandomType() {
		const types = [ 'CAR', 'MOTO', 'BUS' ];
		const attrs = {
			CAR: {
				w: 1,
				h: 0.5,
				color: 'blue'
			},
			MOTO: {
				w: 0.6,
				h: 0.3,
				color: 'red'
			},
			BUS: {
				w: 2,
				h: 0.6,
				color: 'yellow'
			}
		};
		const type = types[Math.round(Math.random() * (types.length - 1))];
		const { w, h, color } = attrs[type];
		this.w = w * this.game.blockSize;
		this.h = h * this.game.blockSize;
		this.color = color;

		const { x, y } = calcCenter(
			{
				x: 0,
				y: this.laneIndex * this.game.blockSize,
				w: this.game.blockSize,
				h: this.game.blockSize
			},
			this
		);

		this.x = x;
		this.y = y;
	}

	update() {
		if (this.direction === 'RIGHT') {
			this.x += this.speed;
			if (this.x > this.game.blockSize * 7 + this.w) {
				this.x = this.w * -1;
			}
		} else {
			this.x -= this.speed;
			if (this.x < this.w * -1) {
				this.x += this.game.blockSize * 9;
			}
		}
	}
}
