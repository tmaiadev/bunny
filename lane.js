class Lane {
	constructor(game, index) {
		this.game = game;
		this.index = index;
		this.x = 0;
		this.y = index * game.blockSize;
		this.w = game.blockSize * 7;
		this.h = game.blockSize;
		this.direction = index % 2 === 0 ? 'RIGHT' : 'LEFT';
		this.type = this._type(index);
		this.color = this.type === 'GRASS' ? 'lawngreen' : 'gray';
		this.speed = 3 + index * 0.01;

		this.vehicles = [];
		if (this.type === 'ROAD') {
			this._addVehicles();
		}
	}

	_addVehicles() {
		const vehicle = new Vehicle(this.game, this.index);
		vehicle.speed = this.speed;
		vehicle.x = Math.random() * this.w;
		vehicle.direction = this.direction;
		this.vehicles.push(vehicle);
	}

	_type = (index) => {
		let road = 1;
		let level = 1;

		for (let i = 0; i <= index; i++) {
			road--;
			if (road < 0) {
				road = Math.round(level);
				level += 0.333;
			}

			if (i === index) {
				return road === 0 ? 'GRASS' : 'ROAD';
			}
		}
	};

	update() {
		this.vehicles.forEach((v) => v.update());
	}
}
