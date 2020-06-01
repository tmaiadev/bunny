class Game {
	constructor() {
		this.$canvas = document.getElementById('canvas');
		this.ctx = this.$canvas.getContext('2d');
		this.objects = [];
		this.lives = 3;
		this.checkpoint = 0;
		this.paused = false;

		window.addEventListener('resize', this.setupGameResolution.bind(this));

		this.setupGameResolution();
		this.setup();
	}

	genLane(index) {
		return new Lane(this, index);
	}

	genLanes(n) {
		return Array(n).fill().map((_, index) => this.genLane(index));
	}

	setupGameResolution() {
		const aspectRatio = this.$canvas.clientHeight / this.$canvas.clientWidth;
		this.screenWidth = 640;
		this.screenHeight = this.screenWidth * aspectRatio;
		this.blockSize = this.screenWidth / 7;
		this.playerSize = this.blockSize * 0.5;

		this.$canvas.width = this.screenWidth;
		this.$canvas.height = this.screenHeight;

		this.camera = new Camera(this);
	}

	setup() {
		this.controls = new Controls();
		this.player = new Player(this);
		this.player.w = this.playerSize;
		this.player.h = this.playerSize;

		const nVisibleLanes = Math.ceil(this.screenHeight / this.blockSize);
		this.lanes = this.genLanes(nVisibleLanes);

		const playerPos = calcCenter(rect(3 * this.blockSize, 0, this.blockSize, this.blockSize), this.player);
		this.player.x = playerPos.x;
		this.player.y = playerPos.y;

		this.update();
	}

	update() {
		// focus camera on player block
		const playerBlock = Math.floor(this.player.y / this.blockSize);
		let blockToFocus = playerBlock - 2;
		if (blockToFocus < 0) blockToFocus = 0;
		this.camera.setY(blockToFocus * this.blockSize);

		// Generate a new lane when last lane is visible
		const lastLane = this.lanes[this.lanes.length - 1];
		if (this.camera.inView(lastLane.x, lastLane.y, lastLane.w, lastLane.h)) {
			this.lanes.push(this.genLane(this.lanes.length));
		}

		// Update Frame
		if (!this.paused) {
			this.camera.update();
			this.player.update();
			this.lanes.forEach((lane) => lane.update());
		}

		// Checkpoint
		const checkpoint = this.lanes.find((lane) => lane.type === 'GRASS' && collide(lane, this.player));
		if (checkpoint) {
			this.checkpoint = checkpoint.index;
		}

		// Collision with car! Player dies
		if (this.lanes.find((lane) => !!lane.vehicles.find((v) => !!collide(v, this.player)))) {
			this.player.die();
			this.lives -= 1;

			setTimeout(() => {
				const { x, y } = calcCenter(
					rect(3 * this.blockSize, this.checkpoint * this.blockSize, this.blockSize, this.blockSize),
					this.player
				);
				this.player.x = x;
				this.player.y = y;
				this.player.dead = false;
			}, 1000);
		}

		// Player controls
		if (!this.paused) {
			if (this.controls.up) this.player.up();
			if (this.controls.down) this.player.down();
			if (this.controls.left) this.player.left();
			if (this.controls.right) this.player.right();
		}

		if (this.controls.esc) this.paused = !this.paused;

		this.controls.clear();

		requestAnimationFrame(this.render.bind(this));
	}

	render() {
		this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

		this.lanes.forEach((lane) => this.camera.render(this.ctx, lane));
		this.camera.render(this.ctx, this.player);
		this.lanes.forEach((lane) => lane.vehicles.forEach((v) => this.camera.render(this.ctx, v)));

		this.update();
	}
}

new Game();
