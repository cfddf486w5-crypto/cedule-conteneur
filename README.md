# DL_RPG_Idle_V1

Offline iPhone-first idle/auto-combat RPG built with **SwiftUI + MVVM** for **iOS 17+**.

## Features (V1)
- Home hub + run continuation
- Auto-combat tick every 1 second
- Power Strike skill (10s cooldown, 3x ATK, 1 stun tick)
- Loot modal with equip/keep/sell actions
- Hero progression, talents, inventory filters
- Shop (potions + chest rolls)
- Settings + reset save + debug panel
- Two zones: Forest and Ruins (Ruins unlocks after Forest boss)
- Fully offline persistence via `UserDefaults`

## Project Structure
- `DL_RPG_Idle_V1.xcodeproj` — Xcode project
- `Sources/` — Swift code (Models, Services, Engine, ViewModels, Views, Utils)
- `Assets.xcassets/` — asset placeholders
- `Info.plist` — iOS app metadata

## Run
1. Open `DL_RPG_Idle_V1.xcodeproj` in Xcode 15+.
2. Select an iPhone simulator (iOS 17+) or connected iPhone.
3. Build and run.

## Persistence & Recovery
- Save key: `DL_RPG_Idle_V1.playerstate`
- Corrupt/missing saves gracefully fall back to a default new game.

## Notes
- No third-party dependencies.
- Designed for portrait iPhone gameplay.
