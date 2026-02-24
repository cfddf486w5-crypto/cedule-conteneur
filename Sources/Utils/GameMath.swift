import Foundation

enum Formula {
    static func xpNeeded(for level: Int) -> Int {
        Int(floor(50 * pow(Double(level), 1.35)))
    }

    static func rounded1(_ value: Double) -> Double {
        (value * 10).rounded() / 10
    }

    static func totalStats(player: PlayerState) -> Stats {
        let equipBonus = player.equipped.all.reduce(Stats()) { $0 + $1.stats }
        let talentBonus = Stats(
            hp: Double(player.talents.hp * 10),
            atk: Double(player.talents.atk * 2),
            def: 0,
            critChance: Double(player.talents.crit) * 0.01,
            critDamage: player.baseStats.critDamage,
            attackSpeed: 0
        )
        return player.baseStats + equipBonus + talentBonus
    }
}

enum RNG {
    static func chance(_ value: Double) -> Bool {
        Double.random(in: 0...1) < value
    }

    static func rarityRoll() -> ItemRarity {
        let roll = Double.random(in: 0...1)
        switch roll {
        case ..<0.70: return .common
        case ..<0.90: return .rare
        case ..<0.99: return .epic
        default: return .legendary
        }
    }
}
