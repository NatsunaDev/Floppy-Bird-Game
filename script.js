const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = './media/flappy-bird-set.png';

let gamePlaying = false;
const gravity = .7;
const speed = 6.2;
const size = [51, 36]
const jump = -11.5;
const cTenth = (canvas.width / 10);

const pipeWitdh = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWitdh)) - pipeWitdh)) + pipeWitdh;


let index = 0,
    bestScore = 0,
    currentScore = 0,
    pipe = [],
    flight,
    flyHeight;

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWitdh)), pipeLoc()]);
}

const render = () => {
    index++;


    //  ctx.drawImage(img, canvas.width, 3*size[0], canvas.width/5, Math.floor((index % 9) / 3) * (6*size[1]), -((index * speed) % canvas.width), 0, canvas.width, canvas.height);


    //Background 
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);




    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    } else {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2 - size[0] / 2)), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);

        ctx.fillText(`Meilleur score :  ${bestScore}`, 55, 245)
        ctx.fillText(`Cliquez pour jouer`, 55, 525)
        ctx.font = "bold 30px courier";
    }

    // Pipe display
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed;

            //top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWitdh, pipe[1], pipe[0], 0, pipeWitdh, pipe[1]);
            //bottom pipe
            ctx.drawImage(img, 432 + pipeWitdh, 108, pipeWitdh, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWitdh, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWitdh) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);


                //remove pipe + creation new one
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWitdh, pipeLoc()]];
            }
            //if hit the pipe, end

            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWitdh >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                setup()
            }

        })
    }


    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    window.requestAnimationFrame(render);
}
setup();
img.onload = render;
document.addEventListener('click', () => (gamePlaying = true));
window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') flight = jump
})
window.onclick = () => flight = jump;