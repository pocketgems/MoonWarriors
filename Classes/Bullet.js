//bullet
var Bullet = function(bulletSpeed, weaponType, attackMode) {
    this.model = null;
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
        var frame = cc.SpriteFrameCache.sharedSpriteFrameCache().spriteFrameByName(weaponType);
        this.model = cc.Sprite.createWithSpriteFrame(frame);
        this.model.setBlendFunc(new cc.BlendFunc(cc.GL_SRC_ALPHA,cc.GL_ONE));
    };
    this.update = function (dt) {
        var newX = this.model.getPositionX(), newY = this.model.getPositionY();
        newX -= this.xVolocity * dt;
        newY -= this.yVolocity * dt;
        this.model.setPosition(cc.ccp(newX, newY));
        if (this.HP <= 0) {
            this.active = false;
        }
    };
    this.destroy = function () {
        var explode = cc.Sprite.create(s_hit);
        explode.setBlendFunc(new cc.BlendFunc(cc.GL_SRC_ALPHA,cc.GL_ONE));
        explode.setPosition(this.model.getPosition());
        explode.setRotation(Math.random()*360);
        explode.setScale(0.75);
        this.model.getParent().addChild(explode,9999);
        cc.ArrayRemoveObject(global.ebulletContainer,this);
        cc.ArrayRemoveObject(global.sbulletContainer,this);
        this.model.getParent().removeChild(this.model);
        var removeExplode = cc.CallFunc.create(explode,explode.removeFromParentAndCleanup);
        explode.runAction(cc.ScaleBy.create(0.3, 2,2));
        explode.runAction(cc.Sequence.create(cc.FadeOut.create(0.3), removeExplode))
        cc.Scheduler.sharedScheduler().unscheduleAllSelectorsForTarget(this);
    };
    this.hurt = function () {
        this.HP--;
    };
    this.collideRect = function(){
        var a = this.model.getContentSize();
        var r = new cc.RectMake(this.model.getPositionX() - 3,this.model.getPositionY() - 3,6,6);
        return r;
    }

    this.ctor(bulletSpeed, weaponType, attackMode);
};