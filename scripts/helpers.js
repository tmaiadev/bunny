function calcCenter(outterObject, centerObject) {
	const diffW = outterObject.w - centerObject.w;
	const diffH = outterObject.h - centerObject.h;

	const x = outterObject.x + diffW / 2;
	const y = outterObject.y + diffH / 2;

	return {
		x,
		y
	};
}

function collide(objA, objB) {
	return objA.x < objB.x + objB.w && objA.x + objA.w > objB.x && objA.y < objB.y + objB.h && objA.y + objA.h > objB.y;
}

function rect(x = 0, y = 0, w = 0, h = 0) {
	return {
		x,
		y,
		w,
		h
	};
}
