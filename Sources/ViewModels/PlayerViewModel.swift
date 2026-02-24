import Foundation
import SwiftUI

final class PlayerViewModel: ObservableObject {
    @Published var player: PlayerState
    @Published var pendingLoot: Item?

    private let persistence = PersistenceService.shared
    private let content = GameContentService.shared

    init() {
        self.player = persistence.load()
    }

    var totalStats: Stats {
        Formula.totalStats(player: player)
    }

    func startRun(zone: Zone) {
        guard player.unlockedZones.contains(zone.id) else { return }
        let enemy = content.enemy(for: zone, stage: 1)
        player.activeRun = RunState(
            zoneId: zone.id,
            stage: 1,
            currentEnemy: enemy,
            heroCurrentHP: totalStats.hp,
            enemyCurrentHP: enemy.maxHP,
            cooldownRemaining: 0,
            stunTicksRemaining: 0,
            potionUsedThisFight: false,
            fightsWon: 0
        )
        save()
    }

    func save() {
        persistence.save(player)
    }

    func resetSave() {
        persistence.reset()
        player = .default
    }

    func gainRewards(xp: Int, gold: Int) {
        player.xp += xp
        player.gold += gold

        while player.xp >= player.xpNeeded {
            player.xp -= player.xpNeeded
            player.level += 1
            player.baseStats.hp += 8
            player.baseStats.atk += 2
            player.baseStats.def = Formula.rounded1(player.baseStats.def + 0.5)
            player.xpNeeded = Formula.xpNeeded(for: player.level)
            if player.level % 2 == 0 {
                player.talentPoints += 1
            }
        }
    }

    func rollLoot() {
        guard RNG.chance(0.60) else {
            pendingLoot = nil
            return
        }
        pendingLoot = content.generateItem(levelFound: player.level)
    }

    func equip(_ item: Item) {
        var equipped = player.equipped
        let old = equipped.item(for: item.slot)
        equipped.set(item: item, for: item.slot)
        player.equipped = equipped

        player.inventory.removeAll { $0.id == item.id }
        if let old {
            player.inventory.append(old)
        }
        pendingLoot = nil
        save()
    }

    func keep(_ item: Item) {
        player.inventory.append(item)
        pendingLoot = nil
        save()
    }

    func sell(_ item: Item) {
        player.gold += item.sellValue
        pendingLoot = nil
        player.inventory.removeAll { $0.id == item.id }
        save()
    }

    func sellInventoryItem(_ item: Item) {
        player.gold += item.sellValue
        player.inventory.removeAll { $0.id == item.id }
        save()
    }

    func equipFromInventory(_ item: Item) {
        equip(item)
    }

    func allocateTalent(_ keyPath: WritableKeyPath<Talents, Int>) {
        guard player.talentPoints > 0 else { return }
        player.talentPoints -= 1
        player.talents[keyPath: keyPath] += 1
        save()
    }

    func unallocateTalent(_ keyPath: WritableKeyPath<Talents, Int>) {
        guard player.talents[keyPath: keyPath] > 0, player.gold >= 25 else { return }
        player.talents[keyPath: keyPath] -= 1
        player.talentPoints += 1
        player.gold -= 25
        save()
    }

    func buyPotion() {
        guard player.gold >= 30 else { return }
        player.gold -= 30
        player.potions += 1
        save()
    }

    func buyChest() {
        guard player.gold >= 100 else { return }
        player.gold -= 100
        let item = content.generateItem(levelFound: max(1, player.level))
        player.inventory.append(item)
        save()
    }

    func unlockNextZoneIfNeeded(zone: Zone, stage: Int) {
        guard stage == 10 else { return }
        if zone == .forest, !player.unlockedZones.contains(Zone.ruins.id) {
            player.unlockedZones.append(Zone.ruins.id)
        }
    }
}
