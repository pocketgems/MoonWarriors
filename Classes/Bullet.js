//bullet
var Bullet = function(bulletSpeed, weaponType, attackMode) {
    this.bullet = new cc.Sprite();
    this.active = true;
    this.xVolocity = 0;
    this.yVolocity = 200;
    this.power = 1;
    this.HP = 1;
    this.moveType = null;
    this.zOrder = 3000;
    this.attackMode = global.AttackMode.Normal;
    this.parentType = global.bulletType.Ship;
    this.ctor = function (bulletSpeed, weaponType, attackMode) {
        this.yVolocity = -bulletSpeed;
        this.attackMode = attackMode;
        cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile(s_bullet_plist);
        this.bullet.initWithSpriteFrameName(weaponType);
        this.bullet.setBlendFunc(new cc.BlendFunc(cc.GL_SRC_ALPHA,cc.GL_ONE));
    };
    this.update = function (dt) {
        var newX = this.getPositionX(), newY = this.getPositionY();
        newX -= this.xVolocity * dt;
        newY -= this.yVolocity * dt;
        this.setPosition(cc.ccp(newX, newY));
        if (this.HP <= 0) {
            this.active = false;
        }
    };
    this.destroy = function () {
        var explode = new additiveSprite();
        explode.initWithFile(s_hit);
        explode.setPosition(this.getPosition());
        explode.setRotation(Math.random()*360);
        explode.setScale(0.75);
        this.getParent().addChild(explode,9999);
       cc.ArrayRemoveObject(global.ebulletContainer,this);
        cc.ArrayRemoveObject(global.sbulletContainer,this);
        this.getParent().removeChild(this);
        var removeExplode = cc.CallFunc.create(explode,explode.removeFromParentAndCleanup);
        explode.runAction(cc.ScaleBy.create(0.3, 2,2));
        explode.runAction(cc.Sequence.create(cc.FadeOut.create(0.3), removeExplode))
    };
    this.hurt = function () {
        this.HP--;
    };
    this.collideRect = function(){
        var a = this.bullet.getContentSize();
        var r = new cc.RectMake(this.bullet.getPositionX() - 3,this.bullet.getPositionY() - 3,6,6);
        return r;
    }

    this.ctor(bulletSpeed, weaponType, attackMode);
};