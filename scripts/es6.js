class Snowflake {
	constructor(canvas) {
		this.canvas = canvas;
		this.setNewParams();
	}

	getRandomInt(max) {
		let rand = Math.floor(Math.random() * Math.floor(max));
		return rand > 0 ? rand : 3;
	}

	setNewParams() {
		this.depth = this.getRandomInt(5);
		this.x = this.getRandomInt(this.canvas.width);
		this.y = -this.getRandomInt(this.canvas.height);
		this.speedX = this.depth * Math.sin(this.getRandomInt(Math.PI * 2));
		this.speedY = this.depth;
		this.radius = this.getRandomInt(3) * this.depth;
	}

	draw() {
		let ctx = this.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}

	animate() {
		this.y += this.speedY;
		this.x += this.speedX * Math.sin(this.y / (5 * this.depth * this.depth));

		if (this.x < 0 || this.x > this.canvas.width) {
			let newX = this.canvas.width - this.x;
			if (newX > this.canvas.width) {
				newX = this.canvas.width;
			} else if (newX < 0) {
				newX = 0;
			}
			this.x = newX;
		}

		if (this.y > this.canvas.height) {
			this.setNewParams();
		}

		this.draw();
	}
}

class Snow {
	constructor(canvas, count) {
		this.prevX = 0;
		this.canvas = canvas;
		this.count = count;
		this.snowflakes = {};
		this.direction = 0;
		this.targetDirection = 0;

		for (let i = 0; i < count; i++) {
			this.snowflakes[i] = new Snowflake(canvas);
			this.snowflakes[i].draw();
		}

		this.canvas.addEventListener("mousemove", (e) => {
			this.parallax(e);
		});
	}

	animate = () => {
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.direction += (this.targetDirection - this.direction) / 20;
		for (let i = 0; i < this.count; i++) {
			this.snowflakes[i].x += this.direction;
			console.log(this.direction);
			this.snowflakes[i].animate();
		}
		requestAnimationFrame(this.animate);
	};

	parallax(e) {
		let direction = Math.tanh(this.prevX - e.clientX);
		this.prevX = e.clientX;

		for (let i = 0; i < this.count; i++) {
			this.targetDirection = direction * (Math.abs(this.snowflakes[i].speedX) + 4);
		}
	}
}

function init() {
	let canvas = document.querySelector("canvas");
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	let ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#FFFFFF";
	ctx.fillStyle = "#FFFFFF";

	let snow = new Snow(canvas, 500);
	snow.animate();
}

export default {
	init: init,
};
