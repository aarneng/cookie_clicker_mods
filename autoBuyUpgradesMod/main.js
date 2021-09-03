const configAutobuy = {
  secondsBetweenUpgrades: 120,
  buyExpensive: true
}

Game.registerMod("autoupgrader mod", {
  init: function () {
    //this function is called as soon as the mod is registered
    //declare hooks here

    Game.Notify(`autoupgrader mod loaded! speed set to: ` + 1000 * configAutobuy.secondsBetweenUpgrades, '', [16, 5]);
    const intervalID = setInterval(
      function () {
        mainAutoUpgrade()
      },
      1000 * configAutobuy.secondsBetweenUpgrades
    )
  },
  save: function () {
    //use this to store persistent data associated with your mod
  },
  load: function (str) {
    //do stuff with the string data you saved previously
  },
});


function mainAutoUpgrade() {
  // Game.Notify(`called main`,'',[16,5]);
  configAutobuy.buyExpensive ? buyMostExpensiveThing() : buyCheapestThing()
}

function buyCheapestThing() {
  let smallestPrice = Infinity;
  let smallestThing;
  let typeOfSmallest;
  const types = ["building", "upgrade"]
  for (let id in Game.ObjectsById) {
    const building = Game.ObjectsById[id]
    let price = building.getPrice()
    if (price < smallestPrice) {
      smallestPrice = price;
      smallestThing = building
      typeOfSmallest = types[0]
    }
  }
  for (let id in Game.UpgradesInStore) {
    let thing = Game.UpgradesInStore[id]
    if (thing.bought === 0) {
      let price = thing.getPrice()
      if (price < smallestPrice && price > 0) {
        smallestPrice = price;
        smallestThing = thing
        typeOfSmallest = types[1]
      }
    }
  }
  if (smallestPrice <= Game.cookies) {
    smallestThing.buy()
    Game.Notify(`automatically bought ${smallestThing.name} for ${Beautify(smallestPrice)} :3`,'',[16,5]);
  }
  else {
    Game.Notify(`everything is too expensive :/ ${smallestPrice}`,'',[16,5]);
  }
}

function buyMostExpensiveThing() {
  let maxPrice = 0;
  let biggestThing;
  const cookiesNow = Game.cookies
  const types = ["building", "upgrade"]
  for (let id in Game.ObjectsById) {
    const building = Game.ObjectsById[id]
    let price = building.getPrice()
    if (price > maxPrice && price < cookiesNow) {
      maxPrice = price;
      biggestThing = building
    }
  }
  for (let id in Game.UpgradesInStore) {
    let thing = Game.UpgradesInStore[id]
    if (thing.bought === 0) {
      let price = thing.getPrice()
      if (price > maxPrice && price > 0 && price < cookiesNow) {
        maxPrice = price;
        biggestThing = thing
      }
    }
  }
  if (maxPrice <= Game.cookies) {
    biggestThing.buy()
    Game.Notify(`automatically bought ${biggestThing.name} for ${Beautify(maxPrice)} :3`,'',[16,5]);
  }
  else {
    Game.Notify(`everything is too expensive :/ ${maxPrice}`,'',[16,5]);
  }
}



