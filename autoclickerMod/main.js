const configAutoclick = {
  clicksPS: 30,
  clickGoldenCookie: true,
  clickWrathCookies: true,
  playAutoclickedCookieClickSound: false
}

Game.registerMod("autoclicker mod", {
  init: function () {
    Game.Notify(`autoclick mod loaded!`, '', [16, 5]);
    const intervalID = setInterval(
      function () {
        mainAutoclick()
      },
      1000 / configAutoclick.clicksPS
    )
  }
});


function mainAutoclick() {
  clickCookie()
  if (configAutoclick.clickGoldenCookie) popShimmers()
}


function clickCookie() {
  // copy of the default click function but with some changes
  var now = Date.now();
  if (Game.OnAscend || Game.AscendTimer > 0 || Game.T < 3) { }
  else {
    if (now - Game.lastClick < 1000 / 15) {
      Game.autoclickerDetected += Game.fps;
      if (Game.autoclickerDetected >= Game.fps * 5) Game.Win('Uncanny clicker');
    }
    Game.loseShimmeringVeil('click');
    var amount = Game.computedMouseCps;
    Game.Earn(amount);
    Game.handmadeCookies += amount;
    if (Game.prefs.particles) {
      Game.particleAdd();
      Game.particleAdd(Game.mouseX, Game.mouseY, Math.random() * 4 - 2, Math.random() * -2 - 2, Math.random() * 0.5 + 0.75, 1, 2);
    }
    if (Game.prefs.numbers) Game.particleAdd(Game.mouseX + Math.random() * 8 - 4, Game.mouseY - 8 + Math.random() * 8 - 4, 0, -2, 1, 4, 2, '', '+' + Beautify(amount, 1));

    Game.runModHook('click');

    if (configAutoclick.playAutoclickedCookieClickSound) Game.playCookieClickSound();
    Game.cookieClicks++;
  }
  Game.lastClick = now;
  Game.Click = 0;
}


function popShimmers() {
  for (var i in Game.shimmers)
  {
    const shimmer = Game.shimmers[i]
    if (configAutoclick.clickWrathCookies || (shimmer.type === "golden" && shimmer.wrath === 0)) shimmer.pop()
  }
}
