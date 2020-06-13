class Player {
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.y = 0;
		this._updateQueue = [];
		this._moveFrames = 12;
		this._timeOfDeath = 0;
		this._baseSize = game.blockSize / 2;
		this.face = 'up';
		this.state = 'idle';
		this.dead = false;
	}

	get color() {
		return this.dead ? 'black' : 'white';
	}

	get texture() {
		return this.game.assets.get(`bunny-${this.state}-${this.face}`);
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

	get h() {
		if (this.state === 'jump') {
			if (this.face === 'up' || this.face === 'down') {
				return this._baseSize * 1.2;
			}
		}

		return this._baseSize;
	}

	get w() {
		if (this.face === 'up' || this.face === 'down') {
			return this._baseSize * 0.7;
		}

		if (this.state === 'jump') {
			return this._baseSize * 1.3;
		}

		return this._baseSize;
	}

	up() {
		if (!this._canMove({ y: this.y + this.game.blockSize })) return;

		this.state = 'jump';
		this.face = 'up';

		for (let i = 0; i < this._moveFrames; i++) {
			const lastFrame = i === this._moveFrames - 1;

			this._updateQueue.push(() => {
				this.y += this.game.blockSize / this._moveFrames;

				if (lastFrame) {
					this.state = 'idle';
				}
			});
		}
	}

	down() {
		if (!this._canMove({ y: this.y - this.game.blockSize })) return;

		this.state = 'jump';
		this.face = 'down';

		for (let i = 0; i < this._moveFrames; i++) {
			const lastFrame = i === this._moveFrames - 1;

			this._updateQueue.push(() => {
				this.y -= this.game.blockSize / this._moveFrames;

				if (lastFrame) {
					this.state = 'idle';
				}
			});
		}
	}

	left() {
		if (!this._canMove({ x: this.x - this.game.blockSize })) return;

		this.state = 'jump';
		this.face = 'left';

		for (let i = 0; i < this._moveFrames; i++) {
			const lastFrame = i === this._moveFrames - 1;

			this._updateQueue.push(() => {
				this.x -= this.game.blockSize / this._moveFrames;

				if (lastFrame) {
					this.state = 'idle';
				}
			});
		}
	}

	right() {
		if (!this._canMove({ x: this.x + this.game.blockSize })) return;

		this.state = 'jump';
		this.face = 'right';

		for (let i = 0; i < this._moveFrames; i++) {
			const lastFrame = i === this._moveFrames - 1;

			this._updateQueue.push(() => {
				this.x += this.game.blockSize / this._moveFrames;

				if (lastFrame) {
					this.state = 'idle';
				}
			});
		}

		this.face = 'right';
	}

	die() {
		this.dead = true;
		this.state = 'jump';
		this.face = 'up';
		this._updateQueue = [];
	}

	update() {
		if (this._updateQueue.length > 0) {
			this._updateQueue[0]();
			this._updateQueue.splice(0, 1);
		}
	}
}
