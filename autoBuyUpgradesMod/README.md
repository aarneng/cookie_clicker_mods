# Autoupgrader mod

Buys upgrades for you automatically!
You can specify whether you want the cheapest, most expensive, or most efficient upgrade bought, and the interval between automatic upgrade purchases

## config:
```
configAutobuy = {
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
  forbiddenUpgradeTypess: [
    "toggle",
    "tech"
  ]
}
```
where:
* `cheapest`/`expensivest`/`efficientest`: enabled: true/false, delayBetweenUpgrades: some number > 0. 
> **NOTE**: you *can* have multiple upgrade processes running at different intervals, but only one is enabled by default.
* `forbiddenUpgrades`: list of strings that stand for upgrade types that cannot be purchased by the autoupgrader. By default, switches and research upgrades are not purchasable. add/remove items as you see fit.
> **NOTE**: it is recommended that neither of the default types are removed, as it could make the game slightly buggy
