import Foundation

enum CombatEvent {
    case log(String)
    case enemyDefeated(xp: Int, gold: Int)
    case heroDefeated
}

final class CombatEngine {
    func heroAttack(totalStats: Stats, enemy: Enemy, enemyHP: inout Double) -> String {
        var raw = max(1, totalStats.atk - enemy.def)
        let crit = RNG.chance(totalStats.critChance)
        if crit { raw *= totalStats.critDamage }
        enemyHP = max(0, enemyHP - raw)
        return crit ? "Hero crit for \(Int(raw))" : "Hero hits for \(Int(raw))"
    }

    func enemyAttack(heroStats: Stats, enemy: Enemy, heroHP: inout Double) -> String {
        let raw = max(1, enemy.atk - heroStats.def)
        heroHP = max(0, heroHP - raw)
        return "\(enemy.name) hits for \(Int(raw))"
    }

    func powerStrike(totalStats: Stats, enemy: Enemy, enemyHP: inout Double) -> String {
        var raw = 3 * totalStats.atk
        let crit = RNG.chance(totalStats.critChance)
        if crit { raw *= totalStats.critDamage }
        let finalDamage = max(1, raw - enemy.def)
        enemyHP = max(0, enemyHP - finalDamage)
        return crit ? "Power Strike CRIT \(Int(finalDamage))" : "Power Strike \(Int(finalDamage))"
    }
}
