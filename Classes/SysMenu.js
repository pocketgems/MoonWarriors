var SysMenu = function () {
    this._ship = null;
    this._layer = new cc.Layer();
    this.init = function () {
        var bRet = false;
        if (this._layer.init()) {
            winSize = cc.Director.sharedDirector().getWinSize();
            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.PointZero());
            this._layer.addChild(sp, 0, 1);

            var logo = cc.Sprite.create(s_logo);
            logo.setAnchorPoint(cc.ccp(0, 0));
            logo.setPosition(cc.ccp(0, 250));
            this._layer.addChild(logo, 10, 1);

            var newGameNormal = cc.Sprite.create(s_menu, cc.RectMake(0, 0, 126, 33));
            var newGameSelected = cc.Sprite.create(s_menu, cc.RectMake(0, 33, 126, 33));
            var newGameDisabled = cc.Sprite.create(s_menu, cc.RectMake(0, 33 * 2, 126, 33));

            var gameSettingsNormal = cc.Sprite.create(s_menu, cc.RectMake(126, 0, 126, 33));
            var gameSettingsSelected = cc.Sprite.create(s_menu, cc.RectMake(126, 33, 126, 33));
            var gameSettingsDisabled = cc.Sprite.create(s_menu, cc.RectMake(126, 33 * 2, 126, 33));

            var aboutNormal = cc.Sprite.create(s_menu, cc.RectMake(252, 0, 126, 33));
            var aboutSelected = cc.Sprite.create(s_menu, cc.RectMake(252, 33, 126, 33));
            var aboutDisabled = cc.Sprite.create(s_menu, cc.RectMake(252, 33 * 2, 126, 33));

            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, this, function () {
                this.onButtonEffect();
                flareEffect(this._layer, this._layer, this.onNewGame);
            });
            var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this, this.onSettings);
            var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled, this, this.onAbout);

            var menu = cc.Menu.create(newGame, gameSettings, about);
            menu.alignItemsVerticallyWithPadding(10);
            this._layer.addChild(menu, 1, 2);
            menu.setPosition(cc.ccp(winSize.width / 2, winSize.height / 2 - 80));
            cc.Scheduler.sharedScheduler().scheduleSelector(this.update, this, 0.1, false);

            var tmp = cc.TextureCache.sharedTextureCache().addImage(s_ship01);
            this._ship = cc.Sprite.createWithTexture(tmp, cc.RectMake(0, 45, 60, 38));
            this._layer.addChild(this._ship, 0, 4);
            this._ship.setPosition(cc.ccp(Math.random() * winSize.width, 0));
            this._ship.runAction(cc.MoveBy.create(2, cc.ccp(Math.random() * winSize.width, this._ship.getPosition().y + winSize.height + 100)));

            if (global.sound) {
                cc.AudioManager.sharedEngine().setBackgroundMusicVolume(0.7);
                cc.AudioManager.sharedEngine().playBackgroundMusic(s_mainMainMusic, true);
            }

            bRet = true;
        }
        return bRet;
    };
    this.onNewGame = function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        scene.addChild(GameControlMenu.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    };
    this.onSettings = function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    };
    this.onAbout = function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    };
    this.update = function () {
        if (this._ship.getPosition().y > 480) {
            this._ship.setPosition(cc.ccp(Math.random() * winSize.width, 10));
            this._ship.runAction(cc.MoveBy.create(parseInt(5 * Math.random()), cc.ccp(Math.random() * winSize.width, this._ship.getPosition().y + 480)));
        }
    };
    this.onButtonEffect = function () {
        if (global.sound) {
            var s = cc.AudioManager.sharedEngine().playEffect(s_buttonEffect);
        }
    };
};

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg._layer;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
