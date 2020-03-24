'use strict'

class Block () {
	square = 'color';
	clickable = true;
	uniqueId = 0;
}

class Field () {
	
}


	let state = 0;
	let colors = [];
	function number(elem) {
		let i = 0;
		let j = 0;
		for (let parent of all_parents){
			if(elem.parentNode == parent)
				break;
			i++;
		}
		for (let child of elem.parentElement.children){
			if(child == elem)
				break;
			j++;
		}
		return 4*i+j
	}
	let square_fin = [];
	square_fin = square_fin.concat(square, square);
	let items = document.getElementsByClassName('item');
	let all_parents = document.getElementsByClassName('item-wrap');
	let shuffled_square_fin = square_fin.sort(() => Math.random() - 0.5);
	let counter = 0;
	for (let item of items){
		item.style.background =  shuffled_square_fin[counter++];
		setTimeout(function() {
			item.style.background = "#FFF";
			item.style.border = "1px solid #000";
			item.onclick = function getColor(){
				if (is_clickable[number(this)]) {
					if(state < 2){
						colors[state] = number(this);;
						item.style.background = shuffled_square_fin[colors[state]];
						state++;
					}
					if(colors.length == 2){
						if (shuffled_square_fin[colors[0]] == shuffled_square_fin[colors[1]]) {
							is_clickable[colors[0]] = is_clickable [colors[1]] = false;

						}
						else{
							setTimeout(function(colors){ return ()=>{
								items[colors[0]].style.background = '#fff'; 
								items[colors[1]].style.background = '#fff';
							}}(colors), 500);
						}
						state = 0;
						colors = [];
					}
				}
			}

		}, 5000);

	}
