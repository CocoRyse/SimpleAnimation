function Snow(canvas, count) {
	let getRandomInt = (max) => {
		let rand = Math.floor(Math.random() * Math.floor(max));
		return rand > 0 ? rand : 3;
	};

	let prevX = 0;
	let snowflakes = {};

	for (let i = 0; i < count; i++) {
		snowflakes[i] = new Snowflake();
		snowflakes[i].draw();
	}

	function Snowflake() {
		this.depth = getRandomInt(5);
		this.x = getRandomInt(canvas.width);
		this.y = -getRandomInt(canvas.height);
		this.speedX = this.depth * Math.sin(getRandomInt(Math.PI * 2));
		this.speedY = this.depth;
		this.radius = getRandomInt(3) * this.depth;
		this.draw = function () {
			let ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		};
	}

	let clear = () => {
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	};

	function animate() {
		clear();
		for (let i = 0; i < count; i++) {
			snowflakes[i].y += snowflakes[i].speedY;
			snowflakes[i].x +=
				snowflakes[i].speedX *
				Math.sin(
					snowflakes[i].y / (5 * snowflakes[i].depth * snowflakes[i].depth) // квадрат для большей рандомности
				);
			// snowflakes[i].x += snowflakes[i].speedX; // без синуса тоже прикольно двигаются

			if (snowflakes[i].x < 0 || snowflakes[i].x > canvas.width) {
				let newX = canvas.width - snowflakes[i].x;
				if (newX > canvas.width) {
					newX = canvas.width;
				} else if (newX < 0) {
					newX = 0;
				}
				snowflakes[i].x = newX;
			}
			if (snowflakes[i].y > canvas.height) {
				snowflakes[i] = new Snowflake();
			}

			snowflakes[i].draw();
		}

		function loop() {
			requestAnimationFrame(animate);
		}

		loop();
	}

	this.parallax = function (e) {
		let direction = Math.tanh(prevX - e.clientX);
		prevX = e.clientX;
		for (let i = 0; i < count; i++) {
			snowflakes[i].x -= direction * (Math.abs(snowflakes[i].speedX) + 4); //
		}
	};

	canvas.addEventListener("mousemove", (e) => {
		this.parallax(e);
	});
	animate();
}

function init() {
	let canvas = document.querySelector("canvas");
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	let ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#FFFFFF";
	ctx.fillStyle = "#FFFFFF";
	let snow = new Snow(canvas, 500);
}

export default {
	init: init,
};
