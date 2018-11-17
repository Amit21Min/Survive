import {
    Sprite,
    Application,
    Rectangle,
    Graphics,
    DisplayObject,
    ticker,
    Text
} from "pixi.js";

import { print } from "introcs";
import { splice } from "../ps04-list-utils/list-utils";
let lives = 10;

let message: Text = new Text("GAME OVER");
let messageBox: Graphics = new Graphics();
let youLost = (): void => {
    app.stage.removeChild(message2);
    message2 = new Text("YOU KILLED " + countKills + " ZOMBIES");
    message.x = 665;
    message.y = 260;
    message.style.fill = 0xff0000;
    message2.style.fill = 0xffffff;
    messageBox.beginFill(0x000000, 10);
    messageBox.drawRect(0, 0, 3000, 3000);
    messageBox.x = 0;
    messageBox.y = 0;
    app.stage.addChild(messageBox);
    app.stage.addChild(message);
    message2.x = 605;
    message2.y = 305;
    app.stage.addChild(message2);
}
let message1: Text = new Text("LIVES LEFT: " + lives);
let livesLeft = (): void => {
    app.stage.removeChild(message1);
    message1 = new Text("LIVES LEFT: " + lives);
    message1.x = 1300;
    message1.y = 0;
    message1.style.fill = 0xffffff;
    app.stage.addChild(message1);
}
let countKills = 0;
let message2: Text = new Text("ZOMBIES KILLED: " + countKills);
let zombiesKilled = (): void => {
    app.stage.removeChild(message2);
    message2 = new Text("ZOMBIES KILLED: " + countKills);
    message2.x = 0;
    message2.y = 0;
    message2.style.fill = 0xffffff;
    app.stage.addChild(message2);
}

const app: Application = new Application(1500, 725);
document.body.appendChild(app.view);

let backgroundWall: Sprite = Sprite.fromImage("./background2.png");
backgroundWall.scale.x *= 2.4;
backgroundWall.scale.y *= 2;
app.stage.addChild(backgroundWall);

let zombie: Sprite = Sprite.fromImage("./zombie.png");
let zombie2: Sprite = Sprite.fromImage("./balloonzombie.png");

let gun: Sprite = Sprite.fromImage("./ray gun.png");
gun.scale.x = 0.2;
gun.scale.y = 0.2;
gun.x = 0;
gun.y = 240;
app.stage.addChild(gun);

// let bullet: Sprite = Sprite.fromImage("./bullet.jpg");
let bullet: Sprite;

let isColliding = (a: DisplayObject, b: DisplayObject): boolean => {
    let ab: Rectangle = a.getBounds();
    let bb: Rectangle = b.getBounds();   
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

window.onkeydown = (e: KeyboardEvent): void => {
    const LEFT: number = 37;
    const UP: number = 38;
    const RIGHT: number = 39;
    let DOWN: number = 40;
    const SPACE: number = 32;
    let STEP: number = 100;
    
    if (e.keyCode === LEFT) {
        gun.x = 0;
    } else if (e.keyCode === UP) {
        if (gun.y < 74) {
            STEP = 0;
        }
        gun.y -= STEP;
    } else if (e.keyCode === RIGHT) {
        gun.x = 0;
    } else if (e.keyCode === DOWN) {
        if (gun.y > 600) {
            STEP = 0;
        }
        gun.y += STEP;
    }
    if (e.keyCode === SPACE) {
        if (bullets.length < 4) {
        createBullet(bullets);
        }
    }
};

let zombies: Sprite[] = [];
// function that can be called every x seconds to create a new zombie in the zombies[] array
let createZombie = (zombies: Sprite[]): void => {
    let zombie: Sprite = Sprite.fromImage("./zombie.png");
    zombie.scale.x = .1;
    zombie.scale.y = .1;
    zombie.x = 1500;
    zombie.y = Math.random() * 350 + 200;
    zombies[zombies.length] = zombie; // how do i make a new zombie and store it in the array
    app.stage.addChild(zombie);
};
let zombies2: Sprite[] = [];
let createZombie2 = (zombies2: Sprite[]): void => {
    let zombie: Sprite = Sprite.fromImage("./balloonzombie.png");
    zombie.scale.x = .4;
    zombie.scale.y = .5;
    zombie.x = 1500;
    zombie.y = Math.random() * 125;
    zombies2[zombies.length] = zombie;
    app.stage.addChild(zombie);
};

let bullets: Sprite[] = [];
let createBullet = (bullets: Sprite[]): void => {
    // let bullet = new Bullets(bullet);
    let bullet: Sprite = Sprite.fromImage("./bullet.png");
    bullet.scale.x = 0.05;
    bullet.scale.y = 0.05;
    bullet.x = gun.x + 90;
    bullet.y = gun.y - 5;
    bullets[bullets.length] = bullet;
    app.stage.addChild(bullet); 
};

let count = 0;
let isAlive = true;

if (isAlive) {
    app.ticker.add((delta: number): void => {
        for (let i = 0; i < zombies.length; i++) {
            let tempZombie = zombies[i]; 
            tempZombie.x -= 5.6;
                        
            let rand = Math.random();
            if (rand > .99) {
                if (tempZombie.y > 200 && rand > .995) {
                        tempZombie.y -= Math.random() * 75;
                    } else if (tempZombie.y < 550) {
                            tempZombie.y += Math.random() * 75;
                        }
                    }
            
            if (zombies[i].x < 0) {
                zombies.slice(i);
                app.stage.removeChild(zombies[i]);
                zombies[i].x = Number.MAX_SAFE_INTEGER;
                lives--;
            }
        }

        for (let i = 0; i < bullets.length; i++) {
            let tempBullet = bullets[i]; 
            tempBullet.x += 25;
            if (tempBullet.x > 1500) {
                bullets.splice(0, i);
                app.stage.removeChild(bullets[i]);
            }
        }

        for (let i = 0; i < zombies.length; i++) {
            for (let j = 0; j < bullets.length; j++) {
                if (isColliding(zombies[i], bullets[j])) {
                    zombies[i].x = 10000;
                    bullets[j].x = 10000;
                    app.stage.removeChild(zombies[i]);
                    app.stage.removeChild(bullets[j]);
                    bullets.splice(j, 1);
                    zombies.slice(i); 
                    countKills++;
                }

            }
        }
        zombiesKilled();
        livesLeft();
        if (lives <= 0) {
            app.ticker.stop();
            youLost();
        }
        count++;
        if (count > 3000) {
            count = 2000;
        }
        if (count % 120 === 0) {
            createZombie2(zombies);
        }
        if (count % 30 === 0) {
            createZombie(zombies);
        }
        if (count > 500) {
            if (count % 100 === 0) {
                createZombie(zombies);
            }
        }

        if (count > 1000) {
            if (count % 30 === 0) {
                createZombie(zombies);
            }
        }
        if (count > 2000) {
            if (count % 30 === 0) {
                createZombie(zombies);
            }
        }
        if (count > 3000) {
            if (count % 20 === 0) {
                createZombie(zombies);
            }
        }



    });
}