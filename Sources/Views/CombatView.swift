import SwiftUI

struct CombatView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel
    @StateObject private var vm = CombatViewModel()
    @State private var timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 12) {
            if let run = playerVM.player.activeRun {
                Text("\((Zone(rawValue: run.zoneId) ?? .forest).displayName) • Stage \(run.stage)/10")
                    .font(.headline)

                panel(title: "Hero", hp: run.heroCurrentHP, maxHP: playerVM.totalStats.hp)
                statsRow
                panel(title: run.currentEnemy.name, hp: run.enemyCurrentHP, maxHP: run.currentEnemy.maxHP)

                HStack {
                    Button("Power Strike") { vm.castPowerStrike(playerVM: playerVM) }
                        .disabled(run.cooldownRemaining > 0)
                    Text(run.cooldownRemaining > 0 ? "CD: \(run.cooldownRemaining)s" : "Ready")
                        .font(.caption)
                    Spacer()
                    Button("Use Potion (\(playerVM.player.potions))") { vm.usePotion(playerVM: playerVM) }
                }

                VStack(alignment: .leading) {
                    Text("Combat Log").font(.subheadline.bold())
                    ForEach(vm.logLines, id: \.self) { Text("• \($0)").font(.caption) }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
            } else {
                Text(vm.runEnded ? "Run finished" : "No active run")
            }
            Spacer()
        }
        .padding()
        .navigationTitle("Combat")
        .onReceive(timer) { _ in vm.tick(playerVM: playerVM) }
        .sheet(item: $playerVM.pendingLoot) { item in
            LootModalView(item: item)
        }
    }

    private func panel(title: String, hp: Double, maxHP: Double) -> some View {
        VStack(alignment: .leading) {
            Text(title).bold()
            ProgressView(value: hp, total: max(1, maxHP))
            Text("\(Int(hp))/\(Int(maxHP)) HP").font(.caption)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 12))
    }

    private var statsRow: some View {
        let s = playerVM.totalStats
        return Text("ATK \(Int(s.atk))  DEF \(String(format: \"%.1f\", s.def))  Crit \(Int(s.critChance * 100))%  SPD \(String(format: \"%.2f\", s.attackSpeed))")
            .font(.caption)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}
