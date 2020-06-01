class Player {
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this._updateQueue = [];
		this._moveFrames = 6;
		this._timeOfDeath = 0;
		this.dead = false;
	}

	get color() {
		return this.dead ? 'black' : 'white';
	}

	up() {
		if (this._updateQueue.length > 0 || this.dead) return;

		Array(this._moveFrames)
			.fill(() => (this.y += this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	down() {
		if (this._updateQueue.length > 0 || this.dead) return;

		const finalY = this.y - this.game.blockSize;
		if (finalY < 0) return;

		Array(this._moveFrames)
			.fill(() => (this.y -= this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	left() {
		if (this._updateQueue.length > 0 || this.dead) return;

		const finalX = this.x - this.game.blockSize;
		if (finalX < 0) return;

		Array(this._moveFrames)
			.fill(() => (this.x -= this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	right() {
		if (this._updateQueue.length > 0 || this.dead) return;

		const finalX = this.x + this.game.blockSize;
		if (finalX > this.game.blockSize * 7) return;

		Array(this._moveFrames)
			.fill(() => (this.x += this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	die() {
		this.dead = true;
		this._updateQueue = [];
	}

	update() {
		if (this._updateQueue.length > 0) {
			this._updateQueue[0]();
			this._updateQueue.splice(0, 1);
		}
	}
}
