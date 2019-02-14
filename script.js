var FIELD_SIZE = 20;
var CELL_SIZE;
var SNAKE_COORD_X, SNAKE_COORD_Y, SNAKE_COORD_Z;
var snake = []; 
var snakeTimer;
var Direction;
var isChange = false;
var SNAKE_SPEED = 500;
var FOOD_SPEED = 1000;
var TELEPORT_SPEED = 2000;
var scores;
var $d = document;
var walls = false;


function init() {
	CELL_SIZE = ($d.documentElement.clientWidth - 100) / FIELD_SIZE / 3;
	buildGameFields();
	$d.getElementById('snake-start').addEventListener('click', handleGameStart);
	$d.getElementById('speed-set').addEventListener('click', handleGameSpeed);
	$d.getElementById('walls-set').addEventListener('click', handleGameWalls);
	window.addEventListener('keydown', handleDirectionChange);
}

function handleDirectionChange(e) {
	if (isChange) {
		return;
	}
	switch (e.keyCode) {
		case 37: 
			if (direction !== 'right') {
				direction = 'left';
			}
		break;
		case 39: 
			if (direction !== 'left') {
				direction = 'right';
			}
		break;
		case 38: 
			if (direction !== 'bottom') {
				direction = 'top';
			}
		break;
		case 40: 
			if (direction !== 'top') {
				direction = 'bottom';
			}
		break;				
	}

	isChange = true;
}

function buildGameFields() {
	var $tables = $d.querySelectorAll('.field');
	
	for (var i = 0; i < 3; i++) {
		
		$tables[i].innerHTML = '';
		
		if(walls) {
			$tables[i].style.height = FIELD_SIZE * CELL_SIZE + 'px';
			$tables[i].classList.add('walls');

		} else {
			$tables[i].classList.remove('walls');
		}

		for (var j = 0; j < FIELD_SIZE; j++) {
			var $row = $d.createElement('div');
			$row.classList.add('row');
			$row.style.height = CELL_SIZE + 'px';

			for (var k = 0; k < FIELD_SIZE; k++) {
				var $cell = $d.createElement('div');
				$cell.classList.add('cell');

				$cell.style.width = CELL_SIZE + 'px';
				$row.appendChild($cell);
			}
			$tables[i].appendChild($row);
		}
	}
}

function respawn() {

	SNAKE_COORD_Z = 1;
	SNAKE_COORD_X = Math.floor(FIELD_SIZE / 2);
	SNAKE_COORD_Y = Math.floor(FIELD_SIZE / 2);

	var $tables = $d.querySelectorAll('.field');
	var $head = getSprite('head-top');
	var $tail = getSprite('tail-top');
	var $body = getSprite('top-bottom');
	$body.dataset.direction = 'top';

	$tables[1].children[SNAKE_COORD_X].children[SNAKE_COORD_Y].appendChild($head);
	$tables[1].children[SNAKE_COORD_X].children[SNAKE_COORD_Y + 1].appendChild($body);
	$tables[1].children[SNAKE_COORD_X].children[SNAKE_COORD_Y + 2].appendChild($tail);

	snake.push($tail);
	snake.push($body);
	snake.push($head);

	direction = 'top';
}


function handleGameStart() {
	if (snakeTimer) {
		clearInterval(snakeTimer);
	}
	scores = 0;
	snake = []; 
	$d.getElementById('snake-score').textContent = 0;
	buildGameFields();
	respawn();
	snakeTimer = setInterval(move, SNAKE_SPEED);
	setTimeout(createFood, FOOD_SPEED);
	setTimeout(createFood, FOOD_SPEED * 2);
	setTimeout(createFood, FOOD_SPEED * 3);
	setTimeout(setTeleports, TELEPORT_SPEED);
}

function handleGameSpeed() {
	(SNAKE_SPEED === 50) ? SNAKE_SPEED = 500 : SNAKE_SPEED -= 50;
	$d.getElementById('speed-set').textContent = 'Speed: ' + (550 - SNAKE_SPEED) / 50;
	if (snakeTimer) {
		clearInterval(snakeTimer);
		snakeTimer = setInterval(move, SNAKE_SPEED);
	}
}

function handleGameWalls() {

	if (!snake.length) {
		$btn = $d.getElementById('walls-set');
		if (walls) {
			$btn.textContent = 'Walls off';
			walls = false;
		} else {
			$btn.textContent = 'Walls on';
			walls = true;
		}
		$btn.classList.toggle('o-button');
		buildGameFields();
	}
}

function createFood() {
	var isCreate = false;
	var $tables = $d.querySelectorAll('.field');

	while (!isCreate) {
		var foodX = Math.floor(Math.random() * FIELD_SIZE);
		var foodY = Math.floor(Math.random() * FIELD_SIZE);
		var foodZ = Math.floor(Math.random() * 3);

		var $appleDiv = $tables[foodZ].children[foodX].children[foodY];

		if ($appleDiv.dataset.type !== 'snake' 
			&& $appleDiv.dataset.tel !== '1' 
			&& $appleDiv.dataset.tel !== '-1') {
			isCreate = true;
			$apple = getSprite('apple');
			$appleDiv.dataset.type = 'apple';
			$appleDiv.appendChild($apple);
		}
	}
}

function setTeleports() {
	var isCreate = false;
	var $tables = $d.querySelectorAll('.field');

	while (!isCreate) {
		var telX = Math.floor(Math.random() * FIELD_SIZE);
		var telY = Math.floor(Math.random() * FIELD_SIZE);
		var telZ = SNAKE_COORD_Z;

		var $telDiv = $tables[telZ].children[telX].children[telY];

		if ($telDiv.dataset.type !== 'snake' 
			&& $telDiv.dataset.type !== 'apple') {
			isCreate = true;
			$teleport = getSprite('teleport');
			$telDiv.dataset.tel = 'teleport';
			$telDiv.appendChild($teleport);
		}
	}	
}

function move() {

	if (isChange) {
		isChange = false;
	}

	var prevDirection = snake[snake.length - 1].dataset.direction;
	var $secondEl = {};

	if ((prevDirection === 'top' && direction === 'top') || 
		(prevDirection === 'bottom' && direction === 'bottom')) {
		$secondEl = getSprite('top-bottom');
	} else if ((prevDirection === 'left' && direction === 'left') || 
		(prevDirection === 'right' && direction === 'right')) {
		$secondEl = getSprite('left-right');
	} else if ((prevDirection === 'top' && direction === 'left') || 
		(prevDirection === 'right' && direction === 'bottom')) {
		$secondEl = getSprite('left-bottom');
	} else if ((prevDirection === 'top' && direction === 'right') || 
		(prevDirection === 'left' && direction === 'bottom')) {
		$secondEl = getSprite('right-bottom');
	} else if ((prevDirection === 'left' && direction === 'top') || 
		(prevDirection === 'bottom' && direction === 'right')) {
		$secondEl = getSprite('right-top');	
	} else if ((prevDirection === 'right' && direction === 'top') || 
		(prevDirection === 'bottom' && direction === 'left')) {
		$secondEl = getSprite('left-top');						
	} else {
		$secondEl = getSprite('left-right');
	}

	snake[snake.length - 1].style.top = $secondEl.style.top;
	snake[snake.length - 1].style.left = $secondEl.style.left;
	snake[snake.length - 1].dataset.direction = direction;

	$secondEl.remove();

	var wallCrash = false;
	switch (direction) {
		case 'top': 
			if (walls && SNAKE_COORD_Y === 0) {
				wallCrash = true;
			}
			(SNAKE_COORD_Y === 0) ? SNAKE_COORD_Y = FIELD_SIZE - 1 : SNAKE_COORD_Y--; 
			var $head = getSprite('head-top');
			break;
		case 'bottom':
			if (walls && SNAKE_COORD_Y === FIELD_SIZE - 1) {
				wallCrash = true;
			} 
			(SNAKE_COORD_Y === FIELD_SIZE - 1) ? SNAKE_COORD_Y = 0 : SNAKE_COORD_Y++;
			var $head = getSprite('head-bottom');
			break;
		case 'right':
			if (walls && SNAKE_COORD_X === 0) {
				wallCrash = true;
			} 		 
			(SNAKE_COORD_X === FIELD_SIZE - 1) ? SNAKE_COORD_X = 0 : SNAKE_COORD_X++;
			var $head = getSprite('head-right');
			break;
		case 'left': 
			if (walls && SNAKE_COORD_X === FIELD_SIZE - 1) {
				wallCrash = true;
			} 		
			(SNAKE_COORD_X === 0) ? SNAKE_COORD_X = FIELD_SIZE - 1 : SNAKE_COORD_X--; 
			var $head = getSprite('head-left');
			break;						
	} 

	var $tables = $d.querySelectorAll('.field');

	var $headCell = $tables[SNAKE_COORD_Z].children[SNAKE_COORD_X].children[SNAKE_COORD_Y];

	if ($headCell.dataset.tel === "teleport") {
		$headCell.dataset.tel = '';
		$headCell.children[0].remove();
		(SNAKE_COORD_Z === 2) ? SNAKE_COORD_Z = 0 : SNAKE_COORD_Z++
		setTeleports();
	}

	if ($headCell.dataset.type !== 'apple') {
		var tailDir = 'tail-' + snake[1].dataset.direction;
		var $newTail = getSprite(tailDir);
		var $div = snake.shift();
		$div.parentNode.dataset.type = '';
		$div.remove();
		snake[0].style.top = $newTail.style.top;
		snake[0].style.left = $newTail.style.left;
		$newTail.remove();


	} else {
		createFood();
		$headCell.children[0].remove();
		scores++;
		$d.getElementById('snake-score').textContent = scores;
	}

	if ($headCell.dataset.type === 'snake' || wallCrash) {
		gameOver();
	} else {
		$headCell.appendChild($head);
		$headCell.dataset.type = 'snake';
		snake.push($head);		
	}

}

function gameOver() {
	snake = [];
	clearInterval(snakeTimer);
	alert('Конец игры!');
}

function getSprite(spriteName) {

	$sprite = $d.createElement('img');
	$sprite.src = 'data/snake-graphics.png';
	$sprite.style.width = CELL_SIZE * 5 + 'px';
	
	switch (spriteName) {
		case 'head-top': 
			$sprite.style.top = '0px';
			$sprite.style.left = -CELL_SIZE * 3 + 'px';
			$sprite.dataset.direction = 'top';
		break;
		case 'head-bottom': 
			$sprite.style.top = -CELL_SIZE * 1 + 'px';
			$sprite.style.left = -CELL_SIZE * 4 + 'px';
			$sprite.dataset.direction = 'bottom';
		break;
		case 'head-left': 
			$sprite.style.top = -CELL_SIZE * 1 + 'px';
			$sprite.style.left = -CELL_SIZE * 3 + 'px';
			$sprite.dataset.direction = 'left';
		break;
		case 'head-right': 
			$sprite.style.top = '0px';
			$sprite.style.left = -CELL_SIZE * 4 + 'px';
			$sprite.dataset.direction = 'right';
		break;	

		case 'tail-bottom': 
			$sprite.style.top = -CELL_SIZE * 3 + 'px';
			$sprite.style.left = -CELL_SIZE * 4 + 'px';
		break;
		case 'tail-top': 
			$sprite.style.top = -CELL_SIZE * 2 + 'px';
			$sprite.style.left = -CELL_SIZE * 3 + 'px';
		break;
		case 'tail-right': 
			$sprite.style.top = -CELL_SIZE * 2 + 'px';
			$sprite.style.left = -CELL_SIZE * 4 + 'px';
		break;	
		case 'tail-left': 
			$sprite.style.top = -CELL_SIZE * 3 + 'px';
			$sprite.style.left = -CELL_SIZE * 3 + 'px';
		break;

		case 'apple': 
			$sprite.style.top = -CELL_SIZE * 3 + 'px';
			$sprite.style.left = '0px';
		break;								

		case 'left-right': 
			$sprite.style.top = -CELL_SIZE * 0 + 'px';
			$sprite.style.left = -CELL_SIZE * 1 + 'px';
		break;
		case 'top-bottom': 
			$sprite.style.top = -CELL_SIZE * 1 + 'px';
			$sprite.style.left = -CELL_SIZE * 2 + 'px';
		break;

		case 'left-top': 
			$sprite.style.top = -CELL_SIZE * 2 + 'px';
			$sprite.style.left = -CELL_SIZE * 2 + 'px';
		break;
		case 'left-bottom': 
			$sprite.style.top = -CELL_SIZE * 0 + 'px';
			$sprite.style.left = -CELL_SIZE * 2 + 'px';
		break;
		case 'right-top': 
			$sprite.style.top = -CELL_SIZE * 1 + 'px';
			$sprite.style.left = -CELL_SIZE * 0 + 'px';
		break;
		case 'right-bottom': 
			$sprite.style.top = -CELL_SIZE * 0 + 'px';
			$sprite.style.left = -CELL_SIZE * 0 + 'px';
		break;				

		case 'teleport': 
			$sprite.src = 'data/teleport.png';
			$sprite.style.width = CELL_SIZE + 'px';
			$sprite.classList.add('animation');
		break;		

	}

	return $sprite
}

window.addEventListener('load', init);