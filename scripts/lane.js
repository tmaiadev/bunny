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
		this.pattern = game.assets.get(this.type === 'GRASS' ? 'grass' : 'asphalt');
		this.speed = 3 + index * 0.01;
		this.vehicles = [];
		this.trees = [];

		if (this.type === 'ROAD') {
			this._addVehicles();
		}

		if (this.type === 'GRASS' && index !== 0) {
			const nTrees = Math.round(Math.random() * 5);
			this._addTrees(nTrees);
		}
	}

	_addVehicles() {
		const vehicle = new Vehicle(this.game, this.index);
		vehicle.speed = this.speed;
		vehicle.x = Math.random() * this.w;
		vehicle.direction = this.direction;
		this.vehicles.push(vehicle);
	}

	_addTrees(nTrees) {
		const availablePositions = [ 0, 1, 2, 4, 5, 6 ];

		for (let i = 0; i < nTrees; i++) {
			const tree = new Tree(this.game);

			const posIndex = Math.round(Math.random() * availablePositions.length);
			const pos = availablePositions[posIndex];

			availablePositions.slice(availablePositions, 1);

			const { x, y } = calcCenter(
				rect(pos * this.game.blockSize, this.y, this.game.blockSize, this.game.blockSize),
				tree
			);

			tree.x = x;
			tree.y = y;

			this.trees.push(tree);
		}
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
