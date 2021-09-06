Game.registerMod("allow achievements mod", {
  init: function () {
    Game.Notify(`allow achievements mod loaded`, '', [16, 5]);
    setTimeout(() => Steam.allowSteamAchievs = true, 5000)
  }
});

