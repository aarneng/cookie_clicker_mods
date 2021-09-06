# Autoclicker mod

Clicks the cookie for you automatically!
You can specify how many clicks/s you want, and if golden cookies should be clicked automatically

## config:
```
configAutoclick = {
  clicksPS: 30,
  clickGoldenCookie: true,
  clickWrathCookies: true,
  playAutoclickedCookieClickSound: false
}
```
where:
* `clicksPS`: Some number > 0. Determines the amount of clicks/second. Not capped by the game's default 25 clicks/s.
* `clickGoldenCookie`: true/false. Determines if golden cookies should be clicked.
* `clickWrathCookies`: true/false. Determines if wrath cookies should be clicked.
* `playAutoclickedCookieClickSound`:  true/false. Determines if autoclicking the cookie should play clicking sound or not.