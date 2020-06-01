class Camera {
	constructor(game) {
		this.game = game;
		this.h = game.screenHeight;
		this.w = game.screenWidth;
		this.x = 0;
		this.y = 0;
		this._targetY = game.blockSize;
		this._updateQueue = [];
	}

	inView(x, y, w, h) {
		const top = y + h;
		const bottom = y;
		const left = x;
		const right = x + w;

		const xAxis = (left >= 0 && left <= this.w) || (right >= 0 && right <= this.w);
		const yAxis = (top >= this.y && top <= this.h + this.y) || (bottom >= this.y && bottom <= this.h + this.y);

		return xAxis && yAxis;
	}

	setY(y) {
		if (y === this._targetY) return;
		this._targetY = y;
		const frames = 60 * 3;
		this._updateQueue = Array(frames).fill().map((_, index) => () => {
			const t = (index + 1) / frames;
			const diff = y - this.y;
			this.y += t * diff;
		});
	}

	update() {
		if (this._updateQueue.length > 0) {
			this._updateQueue[0]();
			this._updateQueue.splice(0, 1);
		}
	}

	render(ctx, { x, y, w, h, color }) {
		if (!this.inView(x, y, w, h)) return;

		ctx.fillStyle = color;
		ctx.fillRect(x, this.h - h - y + this.y, w, h);
	}
}
