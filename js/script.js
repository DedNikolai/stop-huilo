const game = {
  bombCounter: 1,
  timerId: null,
  button: null,
  documentHeight: window.innerHeight,
  huiloCounter: 1,
  killed: 0,
  huiloArray: new Map(),
  bombArray: new Map(),
  huiloIntervalId: null,
  huiloWidth: 80,
  huiloHeight: 120,
  width: 780,
  huiloCreateSpeed: 2000,
  huiloMoveSpeed: 150,
  bombsCount: 10,
  huiloKilled: 0,
  lifes: 3,
  step: 0
};

loadPage();

document.querySelector('.start-btn').addEventListener('click', () => {
    startGame(game.huiloCreateSpeed);
    initialValues();
    document.querySelector('.start-modal').style.bottom = 200 + '%';
    document.querySelector('.start-modal').style.top = 'unset';
    document.querySelector('.start-btn').remove();
});

function initialValues() {
   let lifes = document.querySelector('.lifes');
   let hearts = document.querySelectorAll('.lifes-icon');
   [].forEach.call(hearts, (item) => item.remove());
   document.querySelector('.bombs').textContent = game.bombsCount;
   document.querySelector('.killed').textContent = game.huiloKilled;
   for (let i = 0; i < game.lifes; i++) {
       let div = document.createElement('div');
       div.className = `lifes-icon`;
       document.querySelector('.lifes').append(div);
   }
};

function startGame(createSpeed) {
    game.huiloIntervalId = setInterval(() => createHuilo(game.huiloMoveSpeed), createSpeed);
};

function loadPage() {
    let sides = document.querySelectorAll('.side-container');
    [].forEach.call(sides, item => item.style.width = (window.innerWidth - game.width)/2 + 'px')
};

function moveFly(key) {
    let flyElement = document.querySelector('.fly');

    if (key === 'ArrowRight' && game.button != key) {
        clearInterval(game.timerId)
        game.button = key;
        game.timerId = setInterval(() => {
            let computedStyle = getComputedStyle(flyElement);
            let left = Number.parseInt(computedStyle.left);
            if (left != 740) {
                flyElement.style.left = left + 10 + 'px';
            } else {
                game.button = null;
                clearInterval(game.timerId)
            }
        }, 20)
    }

    if (key === 'ArrowLeft' && game.button != key) {
        clearInterval(game.timerId)
        game.button = key;
        game.timerId = setInterval(() => {
            let computedStyle = getComputedStyle(flyElement);
            let left = Number.parseInt(computedStyle.left);
            if (left != 0) {
                flyElement.style.left = left - 10 + 'px';
            } else {
                game.button = null;
                clearInterval(game.timerId)
            }
        }, 20)
    }
};

function createHuilo(moveSpeed) {
    let huilo = document.createElement('div');
    let number = game.huiloCounter;
    huilo.className = `huilo huilo-${number}`;
    game.huiloCounter += 1;
    document.querySelector('.game-container').append(huilo);
    let left = Math.round(Math.random()*(game.width - game.huiloWidth)) + 'px';
    let bottom = game.documentHeight + 'px';
    huilo.style.left = left;
    huilo.style.bottom = bottom;

    let huiloTimerId = setInterval(() => {
        let currentHuilo = document.querySelector(`.huilo-${number}`);
        let huiloStyle = getComputedStyle(currentHuilo);
        let currentBottom = Number.parseInt(huiloStyle.bottom);
        if (currentBottom < 0) {
            currentHuilo.remove();
            clearInterval(huiloTimerId);
            game.lifes -= 1;
            initialValues();
            if (game.lifes === 0) {
                clearInterval(game.huiloIntervalId);
                document.querySelector('.modal').style.top = 0;
                document.querySelector('.modal').style.bottom = 0;
                document.querySelector('.result-value').textContent = ' ' + game.huiloKilled;

            }
        }
        currentHuilo.style.bottom = currentBottom - 10 + 'px';
    }, moveSpeed);

    game.huiloArray.set(number, huiloTimerId);
}

function isShoot(node, bomb) {
    let nodeleft = Number.parseInt(getComputedStyle(node).left);
    let nodeRight = Number.parseInt(getComputedStyle(node).right);
    let nodeBottom = Number.parseInt(getComputedStyle(node).bottom);
    let bombleft = Number.parseInt(getComputedStyle(bomb).left);
    let bombRight = Number.parseInt(getComputedStyle(bomb).right);
    let bombBottom = Number.parseInt(getComputedStyle(bomb).bottom);
    let huiloKye = +node.className.split('-')[1];
    let bombKey = +bomb.className.split('-')[1];

    function shootHuilo() {
        bomb.remove();
        node.remove();
        game.killed++;
        clearInterval(game.huiloArray.get(huiloKye));
        clearInterval(game.bombArray.get(bombKey));
        game.huiloArray.delete(huiloKye);
        game.bombArray.delete(bombKey);
        game.bombsCount += 2;
        game.huiloKilled += 1;

        if (game.huiloKilled > 0 && game.huiloKilled % 10 === 0) {
            game.step += 1;
            if (game.huiloCreateSpeed != 800) {
                game.huiloCreateSpeed -= 40;
            }

            if (game.huiloMoveSpeed != 20) {
                game.huiloMoveSpeed -= 10;
            }
            clearInterval(game.huiloIntervalId);
            startGame(game.huiloCreateSpeed);
        }
        initialValues();
    };

    if (bombBottom > nodeBottom) {
        if (bombleft >= nodeleft && bombRight >= nodeRight) {
            shootHuilo();
            return;
        }

        if (bombleft >= nodeleft && bombleft < nodeleft + game.huiloWidth) {
            shootHuilo();
            return;
        }

        if (bombRight >= nodeRight && bombRight < nodeRight + game.huiloWidth) {
            shootHuilo();
            return;
        }
    }
};

document.addEventListener('keydown', event => {
    let key = event.code;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
        moveFly(key);
    }

    if (key === 'Space') {
        game.bombsCount -= 1;
        let flyElement = document.querySelector('.fly');
        let bomb = document.createElement('div');
        let number = game.bombCounter;
        bomb.className = `bomb bomb-${number}`;
        game.bombCounter += 1;
        let computedStyle = getComputedStyle(flyElement);
        document.querySelector('.game-container').append(bomb);
        let left = Number.parseInt(computedStyle.left) + 10 + 'px';
        let bottom = Number.parseInt(computedStyle.bottom) + 60 + 'px';
        bomb.style.left = left;
        bomb.style.bottom = bottom;

        let bombTimerId = setInterval(() => {
            let currentBomb = document.querySelector(`.bomb-${number}`);
            let bombStyle = getComputedStyle(currentBomb);
            let currentBottom = Number.parseInt(bombStyle.bottom);
            let huilos = document.querySelectorAll('.huilo');
            [].forEach.call(huilos, item => isShoot(item, currentBomb));
            if (currentBottom < 0) {
                currentBomb.remove();
                clearInterval(bombTimerId);
            } else {
                currentBomb.style.bottom = currentBottom + 10 + 'px';
            }
        }, 20)

        game.bombArray.set(number, bombTimerId);
        initialValues();
    }

    
});

document.addEventListener('keyup', event => {
    let key = event.code;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
        clearInterval(game.timerId);
        game.button = null;
    }
});

document.querySelector('.restart-btn').addEventListener('click', () => location.reload());