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

	_canMove(finalRectProps = {}) {
		const finalRect = {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h,
			...finalRectProps
		};

		if (
			this._updateQueue.length > 0 ||
			this.dead ||
			finalRect.x < 0 ||
			finalRect > this.blockSize * 7 ||
			finalRect.y < 0
		)
			return false;

		const collidedWithObstacle = this.game.obstacles.find((obstacle) => collide(finalRect, obstacle));

		return !collidedWithObstacle;
	}

	up() {
		if (!this._canMove({ y: this.y + this.game.blockSize })) return;

		Array(this._moveFrames)
			.fill(() => (this.y += this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	down() {
		if (!this._canMove({ y: this.y - this.game.blockSize })) return;

		Array(this._moveFrames)
			.fill(() => (this.y -= this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	left() {
		if (!this._canMove({ x: this.x - this.game.blockSize })) return;

		Array(this._moveFrames)
			.fill(() => (this.x -= this.game.blockSize / this._moveFrames))
			.forEach((fn) => this._updateQueue.push(fn));
	}

	right() {
		if (!this._canMove({ x: this.x + this.game.blockSize })) return;

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
