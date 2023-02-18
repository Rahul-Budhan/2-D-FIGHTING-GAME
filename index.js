const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width=1024
canvas.height=576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.5
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x:600,
        y:140
    },
    imageSrc: './img/shop.png',
    scale: 2.65,
    framesMax: 6
})

const player = new Fighter({
    position:{
        x:100,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc:'./img/SamuraiMack/Idle.png',
    framesMax: 8,
    scale:2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/SamuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/SamuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/SamuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/SamuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/SamuraiMack/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './img/SamuraiMack/Attack2.png',
            framesMax: 6
        },
        hit: {
            imageSrc: './img/SamuraiMack/Take hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc:'./img/SamuraiMack/Death.png',
            framesMax:6
        }
    },
    attackBox: {
        offset: {
            x:70,
            y:50
        },
        width:187,
        height:50
    }
})

const enemy = new Fighter({
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    },
    imageSrc: './img/kenji/idle.png',
    framesMax:4,
    scale:2.5,
    offset: {
        x:215,
        y:157
    }
    ,sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: './img/kenji/Attack2.png',
            framesMax: 6
        },
        hit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc:'./img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x:-185,
            y:50
        },
        width:187,
        height:50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}


decreaceTimer()

//Creates each frame
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x=0
    enemy.velocity.x=0

    //Player Movement
    
    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -4
        player.switchSprite('run')    
    } else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 4
        player.switchSprite('run')
    }   else {player.switchSprite('idle')}

    //jumping
    if (player.velocity.y <0) {
        player.switchSprite('jump')
    }  else if (player.velocity.y>0){
        player.switchSprite('fall')
    }

    // Enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -4
        enemy.switchSprite('run')
    }   else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 4
        enemy.switchSprite('run')
    }   else { enemy.switchSprite('idle')}

    //jumping
    if (enemy.velocity.y <0) {
        enemy.switchSprite('jump')
    }  else if (enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }

    //Detect Collision
    if( rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        }) &&   player.isAttacking && player.framesCurrent === 4){
            enemy.takeHit()    
            player.isAttacking= false
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent ===4){
        player.isAttacking = false
    }
    
    if( rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
        }) &&   enemy.isAttacking && enemy.framesCurrent ===2){
            player.takeHit()
        enemy.isAttacking= false
        player.health -=20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent ===2){
        enemy.isAttacking = false
    }

    //End the Game
    if(enemy.health <= 0 || player.health <= 0 ){
        determineWinner({player, enemy, timerId})
    }
}


animate()

window.addEventListener('keydown',(event)=>{
    if (!player.dead){
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -10
            break
        case ' ':
            player.attack()
            break
    }}
    if (!enemy.dead){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -10
            break 
        case 'ArrowDown':
            enemy.attack()
            break
}
    }

})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }

})