const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io();

let AIs = [];

socket.on('worldUpdate', data => {
    AIs = data;
    drawWorld();
});

function drawWorld() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // 背景
    ctx.fillStyle = '#cceeff';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    AIs.forEach(ai=>{
        ctx.fillStyle = ai.hp>50 ? 'green':'red';
        ctx.fillRect(ai.x*10, ai.y*10, 10,10);

        ctx.fillStyle = 'black';
        ctx.fillText(ai.name, ai.x*10, ai.y*10-2);

        ctx.fillStyle = 'orange';
        ctx.fillText(`HP:${ai.hp}`, ai.x*10, ai.y*10+12);

        if(ai.allies.length>0){
            ctx.fillStyle='blue';
            ctx.fillText(`A:${ai.allies.join(',')}`, ai.x*10, ai.y*10+24);
        }
    });
}
