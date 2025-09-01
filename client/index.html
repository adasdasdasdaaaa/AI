const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'client')));

// ----------------- マップ設定 -----------------
const mapWidth = 80;
const mapHeight = 40;
const gravity = 0.5;
const respawnDelay = 5; // 秒
const tileSize = 10;

// 0=空, 1=地面
const worldMap = [];
for(let y=0;y<mapHeight;y++){
    worldMap[y]=[];
    for(let x=0;x<mapWidth;x++){
        if(y > mapHeight/2) worldMap[y][x]=1; // 下半分地面
        else worldMap[y][x]=0;
    }
}

// ----------------- AI定義 -----------------
class AICharacter {
    constructor(name) {
        this.name = name;
        this.hp = 100;
        this.hunger = 100;
        this.resources = { wood: 0, stone: 0 };
        this.inventory = { sword: 0, shield: 0 };
        this.relationships = {};
        this.allies = [];
        this.enemy = null;
        this.x = Math.floor(Math.random() * mapWidth);
        this.y = 0;
        this.vy = 0;
        this.chatLog = [];
        this.dead = false;
        this.respawnTimer = 0;
    }

    decideAction(world, others) {
        if(this.dead) return 'none';
        if (this.hunger < 50) return 'gather';
        if (this.enemy) return 'attack';
        const friend = others.find(o => !this.allies.includes(o.name) && o.name !== this.name);
        if (friend && Math.random() < 0.3) return { type: 'chat', target: friend.name };
        const potentialEnemy = others.find(o => o.name !== this.name && !this.allies.includes(o.name));
        if(potentialEnemy && Math.random() < 0.1) this.enemy = potentialEnemy.name;
        return 'explore';
    }

    performAction(action, world, others) {
        if(this.dead) return;

        if(action === 'gather') {
            const r = Math.random() < 0.5 ? 'wood' : 'stone';
            this.resources[r] += 1;
            this.hunger += 10;
            this.chatLog.push(`Gathered ${r}`);
        } else if(action.type === 'chat') {
            const target = others.find(o => o.name === action.target);
            this.relationships[target.name] = (this.relationships[target.name] || 0) + 10;
            this.chatLog.push(`Chat with ${target.name}`);
            if(this.relationships[target.name] >= 50 && !this.allies.includes(target.name)) {
                this.allies.push(target.name);
                target.allies.push(this.name);
                this.chatLog.push(`Allied with ${target.name}`);
            }
        } else if(action === 'explore') {
            this.x += Math.floor(Math.random() * 3) - 1;
            if(this.x < 0) this.x = 0;
            if(this.x >= mapWidth) this.x = mapWidth-1;
        } else if(action === 'attack') {
            if(this.enemy) {
                const target = others.find(o => o.name === this.enemy);
                if(target && !target.dead){
                    const dmg = 10;
                    target.hp -= dmg;
                    this.chatLog.push(`Attacked ${target.name} -${dmg}`);
                    if(target.hp <= 0){
                        target.hp = 0;
                        target.dead = true;
                        target.respawnTimer = respawnDelay;
                        this.chatLog.push(`${target.name} died`);
                        this.enemy = null;
                    }
                }
            }
        }

        // クラフト
        if(this.resources.wood>=2 && this.resources.stone>=2){
            this.inventory.sword +=1;
            this.resources.wood-=2;
            this.resources.stone-=2;
            this.chatLog.push(`Crafted sword`);
        }

        // 重力
        const belowY = Math.min(mapHeight-1, Math.floor(this.y+1));
        if(worldMap[belowY][this.x] === 0){
            this.vy += gravity;
        } else {
            this.vy = 0;
        }
        this.y += this.vy;
        if(this.y >= mapHeight) this.y = mapHeight-1;

        // 死亡処理
        if(this.hp <=0 && !this.dead){
            this.dead = true;
            this.respawnTimer = respawnDelay;
            this.chatLog.push(`${this.name} died`);
        }

        // リスポーン
        if(this.dead){
            this.respawnTimer -= 1;
            if(this.respawnTimer <=0){
                this.hp = 100;
                this.hunger = 100;
                this.x = Math.floor(Math.random()*mapWidth);
                this.y = 0;
                this.dead = false;
                this.chatLog.push(`${this.name} respawned`);
            }
        }
    }
}

// ----------------- AI生成 -----------------
const AIs = [];
for(let i=0;i<5;i++){
    AIs.push(new AICharacter(`AI_${i+1}`));
}

// ----------------- サーバーループ -----------------
setInterval(()=>{
    AIs.forEach(ai=>{
        const action = ai.decideAction(worldMap, AIs);
        ai.performAction(action, worldMap, AIs);
    });
    io.emit('worldUpdate', {map: worldMap, AIs});
}, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
