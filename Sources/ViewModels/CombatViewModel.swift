import Foundation

final class CombatViewModel: ObservableObject {
    @Published var logLines: [String] = []
    @Published var runEnded = false

    private let engine = CombatEngine()

    func tick(playerVM: PlayerViewModel) {
        guard var run = playerVM.player.activeRun else { return }

        if run.cooldownRemaining > 0 { run.cooldownRemaining -= 1 }

        let heroStats = playerVM.totalStats
        append(engine.heroAttack(totalStats: heroStats, enemy: run.currentEnemy, enemyHP: &run.enemyCurrentHP))

        if run.enemyCurrentHP <= 0 {
            handleVictory(playerVM: playerVM, run: &run)
            return
        }

        if run.stunTicksRemaining > 0 {
            run.stunTicksRemaining -= 1
            append("Enemy is stunned")
        } else {
            append(engine.enemyAttack(heroStats: heroStats, enemy: run.currentEnemy, heroHP: &run.heroCurrentHP))
        }

        if run.heroCurrentHP <= 0 {
            append("Hero defeated")
            playerVM.player.activeRun = nil
            runEnded = true
        } else {
            playerVM.player.activeRun = run
        }
        playerVM.save()
    }

    func castPowerStrike(playerVM: PlayerViewModel) {
        guard var run = playerVM.player.activeRun, run.cooldownRemaining == 0 else { return }
        let heroStats = playerVM.totalStats
        append(engine.powerStrike(totalStats: heroStats, enemy: run.currentEnemy, enemyHP: &run.enemyCurrentHP))
        run.cooldownRemaining = 10
        run.stunTicksRemaining = 1

        if run.enemyCurrentHP <= 0 {
            handleVictory(playerVM: playerVM, run: &run)
            return
        }

        playerVM.player.activeRun = run
        playerVM.save()
    }

    func usePotion(playerVM: PlayerViewModel) {
        guard var run = playerVM.player.activeRun,
              !run.potionUsedThisFight,
              playerVM.player.potions > 0 else { return }

        let maxHP = playerVM.totalStats.hp
        run.heroCurrentHP = min(maxHP, run.heroCurrentHP + maxHP * 0.3)
        run.potionUsedThisFight = true
        playerVM.player.potions -= 1
        append("Potion used (+30% HP)")
        playerVM.player.activeRun = run
        playerVM.save()
    }

    private func handleVictory(playerVM: PlayerViewModel, run: inout RunState) {
        append("Defeated \(run.currentEnemy.name)")
        playerVM.gainRewards(xp: run.currentEnemy.xpReward, gold: run.currentEnemy.goldReward)
        playerVM.rollLoot()
        run.fightsWon += 1

        let zone = Zone(rawValue: run.zoneId) ?? .forest
        playerVM.unlockNextZoneIfNeeded(zone: zone, stage: run.stage)

        if run.stage == 10 {
            playerVM.player.activeRun = nil
            runEnded = true
            append("Run cleared in \(zone.displayName)")
        } else {
            run.stage += 1
            let enemy = GameContentService.shared.enemy(for: zone, stage: run.stage)
            run.currentEnemy = enemy
            run.enemyCurrentHP = enemy.maxHP
            run.heroCurrentHP = playerVM.totalStats.hp
            run.potionUsedThisFight = false
            run.stunTicksRemaining = 0
            run.cooldownRemaining = max(0, run.cooldownRemaining)
            playerVM.player.activeRun = run
        }
        playerVM.save()
    }

    private func append(_ line: String) {
        logLines.insert(line, at: 0)
        if logLines.count > 5 { logLines = Array(logLines.prefix(5)) }
    }
}
