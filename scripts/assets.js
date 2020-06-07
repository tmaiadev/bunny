class Assets {
	constructor() {
		this._items = {};
		this._nloaded = 0;
		this._onLoadedCb = null;

		this.onAssetLoaded = this.onAssetLoaded.bind(this);
	}

	get(key) {
		return this._items[key];
	}

	image(key, path) {
		const img = document.createElement('img');
		img.src = path;
		img.style.display = 'none';

		this._items[key] = img;

		img.onload = this.onAssetLoaded;

		document.body.appendChild(img);
	}

	onAssetLoaded() {
		this._nloaded++;
		if (Object.keys(this._items).length === this._nloaded) {
			this._onLoadedCb && this._onLoadedCb();
		}
	}

	onLoaded(cb) {
		this._onLoadedCb = cb;
	}
}
