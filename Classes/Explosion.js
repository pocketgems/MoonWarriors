var Explosion = function () {
    this.model = null;
    this.tmpWidth = 0;
    this.tmpHeight = 0;
    this.ctor = function () {
        var pFrame = cc.SpriteFrameCache.sharedSpriteFrameCache().spriteFrameByName("explosion_01.png");
        this.model = cc.Sprite.createWithSpriteFrame(pFrame);
        this.tmpWidth = this.model.getContentSize().width;
        this.tmpHeight = this.model.getContentSize().height;
        this.model.setBlendFunc(new cc.BlendFunc(cc.GL_SRC_ALPHA,cc.GL_ONE));

        var animation = cc.AnimationCache.sharedAnimationCache().animationByName("Explosion");
        this.model.runAction(cc.Sequence.create(
            cc.Animate.create(animation, false),
            cc.CallFunc.create(this, this.destroy)
        ));
    };
    this.destroy = function () {
        this.model.getParent().removeChild(this.model);
        cc.Scheduler.sharedScheduler().unscheduleAllSelectorsForTarget(this);
    }

    this.ctor();
};

Explosion.sharedExplosion = function () {
    cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile(s_explosion_plist);
    var animFrames = [];
    var str = "";
    for (var i = 1; i < 35; i++) {
        str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
        var frame = cc.SpriteFrameCache.sharedSpriteFrameCache().spriteFrameByName(str);
        animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 0.04);
    cc.AnimationCache.sharedAnimationCache().addAnimation(animation, "Explosion");
};