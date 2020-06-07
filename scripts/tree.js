class Tree {
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.y = 0;
		this.w = game.blockSize * 0.9;
		this.h = game.blockSize * 0.9;
		this.color = 'forestgreen';

		const r = Math.round(Math.random() * 2) + 1;
		this.texture = game.assets.get('tree' + r);
	}
}
