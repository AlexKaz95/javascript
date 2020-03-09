'use strict'

function createColorsArray(){
	let colorsArray = ['red', 'blue', 'yellow', 'green', 'purple','brown', 'gray', 'black'];
	colorsArray = colorsArray.concat(colorsArray);
	colorsArray = colorsArray.sort(() => Math.random() - 0.5);
	return colorsArray;
}

class FlatSquare{
	constructor(option = {}){
		const {
			colors = '#f0f',
			whidth = 50,
			height = 50,
			margin = 5,
			clickable = true,
			colorPrev = 'white'
		} = option

		this.colors = colors;
		this.whidth = whidth;
		this.height = height;
		this.margin = margin;
		this.clickable = clickable;
		this.colorPrev = colorPrev;
		console.log(this.colors);
	}
	createSquare(){
		const square = document.createElement('div');
		square.style.cssText = `
			background: ${this.colors};
			width: ${this.whidth}px;	
			height: ${this.height}px;	
			margin: ${this.margin}px;
			display: inline-block;
		`
		return square;
	}

	init(selector){
		document.querySelector(selector).append(this.createSquare());

	}









}


