const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io();
let worldMap = [];
let AIs = [];
const mapWidth = 80;
const mapHeight = 40;
const tileSize = 10;

socket.on('worldUpdate', data=>{
    worldMap = data.map;
    AIs = data.AIs;
    drawWorld();
});

function drawWorld(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // 地面描画
    for(let y=0;y<mapHeight;y++){
        for(let x=0;x<mapWidth;x++){
            if(worldMap[y][x]!==0){
                ctx.fillStyle='brown';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
        }
    }

    // AI描画
    AIs.forEach(ai=>{
        ctx.fillStyle = ai.dead ? 'gray' : (ai.hp>50?'green':'red');
        ctx.fillRect(ai.x*tileSize, ai.y*tileSize, tileSize, tileSize);

        ctx.fillStyle='black';
        ctx.fillText(`${ai.name} HP:${ai.hp}`, ai.x*tileSize, ai.y*tileSize-2);

        // チャットログ表示（最新3件）
        ai.chatLog.slice(-3).forEach((msg,i)=>{
            ctx.fillStyle='blue';
            ctx.fillText(msg, 10, canvas.height-(i+1)*15);
        });
    });
}
