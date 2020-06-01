class Controls {
	constructor() {
		this.up = false;
		this.left = false;
		this.right = false;
		this.down = false;
		this.enter = false;
		this.esc = false;

		this._onKeyDown = this._onKeyDown.bind(this);
		this._addListeners();
	}

	_addListeners() {
		window.addEventListener('keydown', this._onKeyDown);
	}

	_onKeyDown({ key }) {
		this.clear();

		switch (key.toLowerCase()) {
			case 'arrowup':
			case 'w':
				this.up = true;
				break;

			case 'arrowleft':
			case 'a':
				this.left = true;
				break;

			case 'arrowright':
			case 'd':
				this.right = true;
				break;

			case 'arrowdown':
			case 's':
				this.down = true;
				break;

			case 'enter':
				this.enter = true;
				break;

			case 'escape':
			case 'p':
				this.esc = true;
				break;

			default:
				break;
		}
	}

	clear() {
		this.up = false;
		this.left = false;
		this.right = false;
		this.down = false;
		this.enter = false;
		this.esc = false;
	}
}
