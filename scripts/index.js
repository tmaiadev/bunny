class Game {
	constructor() {
		this.$canvas = document.getElementById('canvas');
		this.ctx = this.$canvas.getContext('2d');
		this.objects = [];
		this.lives = 3;
		this.checkpoint = 0;
		this.paused = false;
		this.score = 0;
		this.highestY = 0;

		window.addEventListener('resize', this.setupGameResolution.bind(this));
		this.setupGameResolution();

		this.assets = new Assets();
		this.assets.image('grass', 'images/grass.jpg');
		this.assets.image('asphalt', 'images/asphalt.jpg');
		this.assets.image('tree1', 'images/tree1.png');
		this.assets.image('tree2', 'images/tree2.png');
		this.assets.image('tree3', 'images/tree3.png');
		this.assets.image('moto', 'images/moto.png');
		this.assets.image('car', 'images/car.png');
		this.assets.image('bus', 'images/bus.png');
		this.assets.image('bunny-idle-up', 'images/bunny-idle-up.png');
		this.assets.image('bunny-idle-down', 'images/bunny-idle-down.png');
		this.assets.image('bunny-idle-left', 'images/bunny-idle-left.png');
		this.assets.image('bunny-idle-right', 'images/bunny-idle-right.png');
		this.assets.image('bunny-jump-up', 'images/bunny-jump-up.png');
		this.assets.image('bunny-jump-down', 'images/bunny-jump-down.png');
		this.assets.image('bunny-jump-left', 'images/bunny-jump-left.png');
		this.assets.image('bunny-jump-right', 'images/bunny-jump-right.png');
		this.assets.onLoaded(this.setup.bind(this));
	}

	get obstacles() {
		const os = [];
		this.lanes.forEach((l) => l.trees.forEach((t) => os.push(t)));
		return os;
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

		this.$canvas.width = this.screenWidth;
		this.$canvas.height = this.screenHeight;

		this.camera = new Camera(this);
	}

	setup() {
		this.controls = new Controls();
		this.hud = new Hud(this);
		this.player = new Player(this);

		const nVisibleLanes = Math.ceil(this.screenHeight / this.blockSize);
		this.lanes = this.genLanes(nVisibleLanes);

		const playerPos = calcCenter(rect(3 * this.blockSize, 0, this.blockSize, this.blockSize), this.player);
		this.player.x = playerPos.x;
		this.player.y = playerPos.y;

		this.highestY = this.player.y;

		this.update();
	}

	update() {
		// Update score
		if (this.player.y > this.highestY) {
			const diff = this.player.y - this.highestY;
			this.score += Math.round(diff * this.lives / 10);
			this.highestY = this.player.y;
		}

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
		if (!this.player.dead && this.lanes.find((lane) => !!lane.vehicles.find((v) => !!collide(v, this.player)))) {
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
				this.player.state = 'idle';
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

		this.lanes.forEach((lane) => {
			this.camera.render(this.ctx, lane);
			lane.trees.forEach((tree) => this.camera.render(this.ctx, tree));
		});
		this.camera.render(this.ctx, this.player);
		this.lanes.forEach((lane) => lane.vehicles.forEach((v) => this.camera.render(this.ctx, v)));

		this.hud.renderScore(this.ctx, this.score);

		this.update();
	}
}

new Game();
