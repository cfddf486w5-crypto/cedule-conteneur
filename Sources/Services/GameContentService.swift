import Foundation

struct EnemyTemplate {
    let name: String
    let baseHP: Double
    let baseATK: Double
    let baseDEF: Double
    let baseXP: Int
    let baseGold: Int
}

final class GameContentService {
    static let shared = GameContentService()

    private let forestMobs: [EnemyTemplate] = [
        EnemyTemplate(name: "Slime", baseHP: 45, baseATK: 7, baseDEF: 1, baseXP: 20, baseGold: 12),
        EnemyTemplate(name: "Wolf", baseHP: 52, baseATK: 8, baseDEF: 1.5, baseXP: 22, baseGold: 14),
        EnemyTemplate(name: "Bandit", baseHP: 60, baseATK: 9, baseDEF: 2, baseXP: 25, baseGold: 16)
    ]

    private let ruinsMobs: [EnemyTemplate] = [
        EnemyTemplate(name: "Skeleton", baseHP: 95, baseATK: 13, baseDEF: 4, baseXP: 36, baseGold: 22),
        EnemyTemplate(name: "Cultist", baseHP: 88, baseATK: 15, baseDEF: 3.2, baseXP: 38, baseGold: 25),
        EnemyTemplate(name: "Stone Imp", baseHP: 100, baseATK: 12, baseDEF: 5, baseXP: 40, baseGold: 26)
    ]

    private let bosses: [Zone: EnemyTemplate] = [
        .forest: EnemyTemplate(name: "Bear King", baseHP: 180, baseATK: 16, baseDEF: 4, baseXP: 90, baseGold: 60),
        .ruins: EnemyTemplate(name: "Ancient Golem", baseHP: 360, baseATK: 25, baseDEF: 8, baseXP: 180, baseGold: 130)
    ]

    func enemy(for zone: Zone, stage: Int) -> Enemy {
        let template: EnemyTemplate
        if stage == 10, let boss = bosses[zone] {
            template = boss
        } else {
            switch zone {
            case .forest: template = forestMobs.randomElement() ?? forestMobs[0]
            case .ruins: template = ruinsMobs.randomElement() ?? ruinsMobs[0]
            }
        }

        let hp = template.baseHP * (1 + Double(stage) * 0.18)
        let atk = template.baseATK * (1 + Double(stage) * 0.12)
        let def = template.baseDEF * (1 + Double(stage) * 0.08)

        return Enemy(
            name: template.name,
            maxHP: hp.rounded(),
            atk: atk.rounded(),
            def: Formula.rounded1(def),
            xpReward: Int(Double(template.baseXP) * (1 + Double(stage) * 0.15)),
            goldReward: Int(Double(template.baseGold) * (1 + Double(stage) * 0.2)),
            special: stage == 10 ? "Boss" : nil
        )
    }

    func generateItem(levelFound: Int) -> Item {
        let rarity = RNG.rarityRoll()
        let slot = ItemSlot.allCases.randomElement() ?? .weapon
        let mult = rarity.multiplier

        var stats = Stats()
        let name: String

        switch slot {
        case .weapon:
            stats.atk = (8 + Double(levelFound) * 1.5) * mult
            stats.atk.round()
            name = "\(rarity.rawValue.capitalized) Blade"
        case .armor:
            stats.hp = (25 + Double(levelFound) * 4) * mult
            stats.hp.round()
            stats.def = Formula.rounded1((2 + Double(levelFound) * 0.3) * mult)
            name = "\(rarity.rawValue.capitalized) Armor"
        case .ring:
            if Bool.random() {
                stats.critChance = ((0.02 + Double(levelFound) * 0.002) * mult * 1000).rounded() / 1000
                name = "\(rarity.rawValue.capitalized) Crit Ring"
            } else {
                stats.attackSpeed = ((0.05 + Double(levelFound) * 0.003) * mult * 1000).rounded() / 1000
                name = "\(rarity.rawValue.capitalized) Swift Ring"
            }
        }

        let sell = Int(10 * mult * (1 + Double(levelFound) * 0.2))

        return Item(
            id: UUID(),
            name: name,
            slot: slot,
            rarity: rarity,
            levelFound: levelFound,
            stats: stats,
            sellValue: sell
        )
    }
}
