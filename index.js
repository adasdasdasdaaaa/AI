const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// クライアント配信
app.use(express.static(path.join(__dirname, 'client')));

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
        this.x = Math.floor(Math.random() * 50);
        this.y = Math.floor(Math.random() * 20);
    }

    decideAction(world, others) {
        if (this.hunger < 50) return 'gather';
        if (this.enemy) return 'attack';

        const friend = others.find(o => !this.allies.includes(o.name) && o.name !== this.name);
        if (friend && Math.random() < 0.3) return { type: 'chat', target: friend.name };

        const potentialEnemy = others.find(o => o.name !== this.name && !this.allies.includes(o.name));
        if (potentialEnemy && Math.random() < 0.1) this.enemy = potentialEnemy.name;

        return 'explore';
    }

    performAction(action, world, others) {
        if(action === 'gather') {
            const r = Math.random() < 0.5 ? 'wood' : 'stone';
            this.resources[r] += 1;
            this.hunger += 10;
        } else if(action.type === 'chat') {
            const target = others.find(o => o.name === action.target);
            this.relationships[target.name] = (this.relationships[target.name] || 0) + 10;
            if(this.relationships[target.name] >= 50 && !this.allies.includes(target.name)) {
                this.allies.push(target.name);
                target.allies.push(this.name);
            }
        } else if(action === 'explore') {
            this.x += Math.floor(Math.random() * 3) - 1;
            this.y += Math.floor(Math.random() * 3) - 1;
            if(this.x < 0) this.x = 0;
            if(this.y < 0) this.y = 0;
            if(this.x > 79) this.x = 79;
            if(this.y > 39) this.y = 39;
        } else if(action === 'attack') {
            if(this.enemy) {
                const target = others.find(o => o.name === this.enemy);
                if(target) {
                    const dmg = 10;
                    target.hp -= dmg;
                    if(target.hp <= 0) {
                        target.hp = 0;
                        this.enemy = null;
                    }
                }
            }
        }

        // 自動クラフト
        if(this.resources.wood >= 2 && this.resources.stone >= 2) {
            this.inventory.sword += 1;
            this.resources.wood -= 2;
            this.resources.stone -= 2;
        }
    }
}

// ----------------- 世界とAI生成 -----------------
const world = {};
const AIs = [];
for(let i=0;i<5;i++){
    AIs.push(new AICharacter(`AI_${i+1}`));
}

// ----------------- サーバーループ -----------------
setInterval(()=>{
    AIs.forEach(ai=>{
        const action = ai.decideAction(world, AIs);
        ai.performAction(action, world, AIs);
    });
    io.emit('worldUpdate', AIs.map(ai=>({
        name: ai.name,
        hp: ai.hp,
        hunger: ai.hunger,
        x: ai.x,
        y: ai.y,
        allies: ai.allies,
        resources: ai.resources,
        inventory: ai.inventory
    })));
}, 1000);

// ポート設定
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
