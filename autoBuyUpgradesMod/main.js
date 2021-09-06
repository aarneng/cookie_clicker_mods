const configAutobuy = {
  cheapest: {
    enabled: false,
    delayBetweenUpgrades: 45
  },
  expensivest: {
    enabled: false,
    delayBetweenUpgrades: 45
  },
  efficientest: {
    enabled: true,
    delayBetweenUpgrades: 120
  },
  forbiddenUpgradeTypes: [
    "toggle",
    "tech"
  ]
}



Game.registerMod("autoupgrader mod", {
  init: function () {
    let infoStr = configAutobuy.cheapest.enabled 
      ? `buying cheapest item every ${configAutobuy.cheapest.delayBetweenUpgrades} seconds`
      : "buying cheapest: not enabled"
    infoStr += "<br>" + ( configAutobuy.expensivest.enabled
      ? `buying most expensive item item every ${configAutobuy.expensivest.delayBetweenUpgrades} seconds`
      : "buying most expensive: not enabled" 
    )
    infoStr += "<br>" + ( configAutobuy.efficientest.enabled
      ? `buying most efficient item item every ${configAutobuy.efficientest.delayBetweenUpgrades} seconds`
      : "buying most efficient: not enabled"
    )
    Game.Notify(`autoupgrader mod loaded!`, "config: <br>" + infoStr, [16, 5]);

    mainAutoobjectOrUpgrade()
  }
});


function mainAutoobjectOrUpgrade() {
  try {
    if (configAutobuy.cheapest.enabled) {
      setInterval(() => buyCheapestThing(), configAutobuy.cheapest.delayBetweenUpgrades * 1000)
    }
    if (configAutobuy.expensivest.enabled) {
      setInterval(() => buyMostExpensiveThing(), configAutobuy.expensivest.delayBetweenUpgrades * 1000)
    }
    if (configAutobuy.efficientest.enabled) {
      setInterval(() => {    
        try {
          buyMostEfficientThing()
        }
        catch (e) {
          Game.Notify(``, JSON.stringify(e.message), [16, 5]);
    
        }
      }, configAutobuy.efficientest.delayBetweenUpgrades * 1000)
    }
  }
  catch (e) {
    Game.Notify(`autoupgrader mod ran into an error: `, JSON.stringify(e), [16, 5]);
  }
}


function buyCheapestThing() {
  const badTypes = configAutobuy.forbiddenUpgradeTypes
  const allBuyables = Game.ObjectsById.concat(Game.UpgradesInStore).filter(i => !badTypes.includes(i.pool))
  allBuyables.sort((a, b) => a.getPrice() - b.getPrice())
  buyFirstAvailableThing(allBuyables)
}

function buyMostExpensiveThing() {
  const badTypes = configAutobuy.forbiddenUpgradeTypes
  const allBuyables = Game.ObjectsById.concat(Game.UpgradesInStore).filter(i => !badTypes.includes(i.pool))
  allBuyables.sort((a, b) => b.getPrice() - a.getPrice())
  buyFirstAvailableThing(allBuyables)
}


function buyMostEfficientThing() {
  const badTypes = configAutobuy.forbiddenUpgradeTypes
  const allBuyables = Game.ObjectsById.concat(Game.UpgradesInStore).filter(i => !badTypes.includes(i.pool))
  allBuyables.sort((a, b) => {
    const efficiencyA = additionalCPSPerCookieSpent(a)
    const efficiencyB = additionalCPSPerCookieSpent(b)
    return efficiencyB - efficiencyA
  })
  buyFirstAvailableThing(allBuyables)
}


function additionalCPSPerCookieSpent(buyable) {
  const cpsBefore = Game.cookiesPs
  const cost = buyable.getPrice()
  let cpsAfter;
  if (buyable.type === "upgrade") {
    toggleUpgradeWithNoSound(buyable) // "buy"
    Game.CalculateGains() // recalculate CPS
    cpsAfter = Game.cookiesPs
    toggleUpgradeWithNoSound(buyable) // "sell"
    Game.CalculateGains() // reset to true CPS
  }
  else {
    buyable.buyFree(1)
    Game.CalculateGains()
    cpsAfter = Game.cookiesPs
    buyable.sacrifice(1)
    Game.CalculateGains()
  }
  if (cost === 0) return 1
  return (cpsAfter - cpsBefore) / cost
}

function buyFirstAvailableThing(listOfBuyables) {
  for (let buyable of listOfBuyables) {
    let price = buyable.getPrice()
    if (price <= Game.cookies) {
      buyable.buy()
      Game.Notify(`automatically bought ${buyable.name} for ${Beautify(price)}`,'',[16,5]);
      return
    }
  }
  Game.Notify(`couldn't buy anything, there isn't enough money`,'',[16,5]);
}

function toggleUpgradeWithNoSound(upgrade) {
// copy of the default .toggle method but with play sound functions removed

  if (!upgrade.bought)
  {
    upgrade.bought=1;
    if (upgrade.buyFunction) upgrade.buyFunction();
    Game.upgradesToRebuild=1;
    Game.recalculateGains=1;
    if (Game.CountsAsUpgradeOwned(upgrade.pool)) Game.UpgradesOwned++;
  }
  else
  {
    upgrade.bought=0;
    Game.upgradesToRebuild=1;
    Game.recalculateGains=1;
    if (Game.CountsAsUpgradeOwned(upgrade.pool)) Game.UpgradesOwned--;
  }
  if (Game.onMenu=='stats') Game.UpdateMenu();
}