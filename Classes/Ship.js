var Ship = function () {
    var selfPointer = this;
    this.model = null;
    this._timeTick = 0;
    this.speed = 220;
    this.bulletSpeed = 900;
    this.HP = 10;
    this.bulletTypeValue = 1;
    this.bulletPowerValue = 1;
    this.throwBombing = false;
    this.canBeAttack = true;
    this.isThrowingBomb = false;
    this.zOrder = 3000;
    this.maxBulletPowerValue = 4;
    this.appearPosition = cc.ccp(160, 60);
    this._hurtColorLife = 0;
    this.active = true;
    this.ctor = function () {
        //init life
        var shipTexture = cc.TextureCache.sharedTextureCache().addImage(s_ship01);
        this.model = cc.Sprite.createWithTexture(shipTexture, cc.RectMake(0, 0, 60, 38));
        //this.model.initWithTexture(shipTexture, cc.RectMake(0, 0, 60, 38));
        this.model.setTag(this.zOrder);
        this.model.setPosition(this.appearPosition);

        // set frame
        var animation = cc.Animation.create();
        animation.addFrameWithTexture(shipTexture, cc.RectMake(0, 0, 60, 38));
        animation.addFrameWithTexture(shipTexture, cc.RectMake(60, 0, 60, 38));

        // ship animate
        var action = cc.Animate.create(0.1, animation, true);
        this.model.runAction(cc.RepeatForever.create(action));
        cc.Scheduler.sharedScheduler().scheduleSelector(this.shoot, this, 1 / 6, false);

        //revive effect
        this.canBeAttack = false;
        var ghostSprite = new cc.Sprite.createWithTexture(shipTexture, cc.RectMake(0, 45, 60, 38));
        this.model.setBlendFunc(new cc.BlendFunc(cc.GL_SRC_ALPHA, cc.GL_ONE));
        ghostSprite.setScale(8);
        ghostSprite.setPosition(cc.ccp(this.model.getContentSize().width / 2, 12));
        this.model.addChild(ghostSprite, 3000, 99999);
        ghostSprite.runAction(cc.ScaleTo.create(0.5, 1, 1));
        var blinks = cc.Blink.create(3, 9);
        var makeBeAttack = cc.CallFunc.create(this, function (t) {
            selfPointer.canBeAttack = true;
            selfPointer.model.setIsVisible(true);
            selfPointer.model.removeChild(ghostSprite);
        });
        this.model.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));
    };
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
    this.shoot = function (dt) {
        if (this.model.getParent()) {
            var offset = 13;
            var a = new Bullet(this.bulletSpeed, "W1.png", global.AttackMode.Normal);
            global.sbulletContainer.push(a);
            this.model.getParent().addChild(a.model, a.zOrder, global.Tag.ShipBullet);
            a.model.setPosition(cc.ccp(this.model.getPosition().x + offset, this.model.getPosition().y + 3 + this.model.getContentSize().height * 0.3));

            var b = new Bullet(this.bulletSpeed, "W1.png", global.AttackMode.Normal);
            global.sbulletContainer.push(b);
            this.model.getParent().addChild(b.model, b.zOrder, global.Tag.ShipBullet);
            b.model.setPosition(cc.ccp(this.model.getPosition().x - offset, this.model.getPosition().y + 3 + this.model.getContentSize().height * 0.3));
        }
    };
    this.destroy = function () {
        (global.life > 0) ? global.life-- : 0;
        if (this.model.getParent()) {
            var exp = new Explosion(this.model.getPosition().x, this.model.getPosition().y);
            this.model.getParent().addChild(exp.model);
            this.model.getParent().removeChild(this.model);
        }
        if (global.sound) {
            cc.AudioManager.sharedEngine().playEffect(s_shipDestroyEffect);
        }
        cc.Scheduler.sharedScheduler().unscheduleAllSelectorsForTarget(this);
    };
    this.hurt = function () {
        if (this.canBeAttack) {
            this._hurtColorLife = 2;
            selfPointer.HP--;
            this.model.setColor(cc.RED());
        }
    };
    this.collideRect = function () {
        var a = this.model.getContentSize();
        var r = new cc.RectMake(this.model.getPositionX() - a.width / 2, this.model.getPositionY() - a.height / 2, a.width, a.height / 2);
        return r;
    };
    this.ctor();
};
