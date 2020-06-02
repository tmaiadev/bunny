class Hud {
	constructor(game) {
		this.game = game;
	}

	renderScore(ctx, score) {
		ctx.font = '30px Courier New';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'right';
		ctx.fillText(score, this.game.screenWidth - 30, 50);
	}
}
