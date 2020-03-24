'use strict'
//получение элементов со страницы
const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');
//создание объекта, который будет менять данные о выстрелах 
const play = {
	record: 0,
	shot: 0,
	hit: 0,
	dead: 0,
//сеттер. Смысл сеттера в том, чтобы передавать данные не запариваясь о том, как именно они устанавливаются
	set updateData(data){
		this[data]++;
		this.render();
	},
//выводит измененные данные на странице с помощью метода textContent
	render(){
		record.textContent = this.record;
		shot.textContent = this.shot;
		hit.textContent = this.hit;
		dead.textContent = this.dead;
	}
};
//объект содержащий данные о кораблях. Содержит позицию корабля в ячейках и информацию о том, подбит ли корабль.
const game = {
	ships: [
		{
			location: ['26','36','46','56'],
			hit: ['','','','']
		},
		{
			location: ['11','12','13'],
			hit: ['','','']
		},
		{
			location: ['69','79'],
			hit: ['','']
		},
		{
			location: ['32'],
			hit: ['']
		},
	],
	shipsCount: 4,
}
// объект, содержащих набор методов, изменяющих классы элементов, по которым произошло нажатие
const show = {
	hit(elem){
		this.changeClass(elem, 'hit');
	},
	miss(elem){
		this.changeClass(elem, 'miss');
	},
	dead(elem){
		this.changeClass(elem, 'dead');
	},
	changeClass(elem, value){
		elem.className = value;
	}
};
// основная функция отслеживания и обработки кликов
// принимает объект переданный методом addEventListener
const fire = (event) => { 
	const target = event.target;
	if (target.classList.length !== 0 || target.tagName !== 'TD') return;
	play.updateData = 'shot';
	show.miss(target);
	console.log(target);
	for (let i = 0; i < game.ships.length; i++) {
		const index = game.ships[i].location.indexOf(target.id);
		if (index >= 0){
			show.hit(target);
			play.updateData = 'hit';
			game.ships[i].hit[index] = 'x';
			if (game.ships[i].hit.indexOf('') < 0){
				play.updateData = 'dead';
				for (const id of game.ships[i].location){
					show.dead(document.getElementById(id));
				}
				game.shipsCount--;
				if(game.shipsCount < 1){
					header.innerText = 'Игра окончена';
				}
			}
		}
	}
}
// function expression + стрелочная функция лямбда функция
// функция которая отслеживает событие указанное аргументом 1 и вызывает событие аргумента 2. Причем в аргумент 2 передает объект, который кучу всего в себе содержит
const init = () => {
	enemy.addEventListener('click', fire);
};
//вызов
init();