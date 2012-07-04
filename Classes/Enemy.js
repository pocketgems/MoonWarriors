var Enemy = function (arg) {
    this.model = null;
    this.eID = 0;
    this.active = true;
    this.speed = 200;
    this.bulletSpeed = -200;
    this.HP = 15;
    this.bulletPowerValue = 1;
    this.moveType = null;
    this.scoreValue = 200;
    this.zOrder = 1000;
    this.delayTime = 1 + 1.2 * Math.random();
    this.attackMode = global.AttackMode.Normal;
    this._hurtColorLife = 0;
    this.ctor = function (arg) {
        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.scoreValue = arg.scoreValue;
        this.attackMode = arg.attackMode;

        var pFrame = cc.SpriteFrameCache.sharedSpriteFrameCache().spriteFrameByName(arg.textureName);
        this.model = cc.Sprite.createWithSpriteFrame(pFrame);
        cc.Scheduler.sharedScheduler().scheduleSelector(this.shoot, this, this.delayTime, false);
    };
    this._timeTick = 0;
    this.update = function (dt) {
        if (this.HP <= 0) {
            this.active = false;
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
            if (this._hurtColorLife == 1) {
                this.model.setColor(new cc.Color3B(255, 255, 255));
            }
        }
    };
    this.destroy = function () {
        global.score += this.scoreValue;
        var a = new Explosion();
        a.model.setPosition(this.model.getPosition());
        this.model.getParent().addChild(a.model);
        spark(this.model.getPosition(), this.model.getParent(), 1.2, 0.7);
        cc.ArrayRemoveObject(global.enemyContainer, this);
        this.model.getParent().removeChild(this.model);
        if (global.sound) {
            cc.AudioManager.sharedEngine().playEffect(s_explodeEffect);
        }
        cc.Scheduler.sharedScheduler().unscheduleAllSelectorsForTarget(this);
    };
    this.shoot = function () {
        if(this.model.getParent()){
        var b = new Bullet(this.bulletSpeed, "W2.png", this.attackMode);
        global.ebulletContainer.push(b);
       // console.log(this.model.getParent())
        this.model.getParent().addChild(b.model, b.zOrder, global.Tag.EnemyBullet);
        b.model.setPosition(cc.ccp(this.model.getPosition().x, this.model.getPosition().y - this.model.getContentSize().height * 0.2));
        }
    };
    this.hurt = function () {
        this._hurtColorLife = 2;
        this.HP--;
        this.model.setColor(cc.RED());
    };
    this.collideRect = function () {
        var a = this.model.getContentSize();
        var r = new cc.RectMake(this.model.getPositionX() - a.width / 2, this.model.getPositionY() - a.height / 4, a.width, a.height / 2);
        return r;
    }
    this.ctor(arg);
};

Enemy.sharedEnemy = function () {
    cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile(s_Enemy_plist, s_Enemy);
};
