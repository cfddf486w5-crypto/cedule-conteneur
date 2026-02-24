import SwiftUI

struct HeroView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel

    var body: some View {
        let p = playerVM.player
        let total = playerVM.totalStats
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text("Level \(p.level)").font(.title2.bold())
                ProgressView(value: Double(p.xp), total: Double(max(1, p.xpNeeded)))
                Text("XP \(p.xp)/\(p.xpNeeded)")

                GroupBox("Stats") {
                    VStack(alignment: .leading) {
                        Text("Base ATK \(Int(p.baseStats.atk))  + Total \(Int(total.atk))")
                        Text("Base HP \(Int(p.baseStats.hp))  + Total \(Int(total.hp))")
                        Text("DEF \(String(format: \"%.1f\", total.def))")
                        Text("Crit \(Int(total.critChance * 100))%")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                GroupBox("Talents (Points: \(p.talentPoints), Reset cost: 25g)") {
                    talentRow("+ATK", value: p.talents.atk, keyPath: \.atk)
                    talentRow("+HP", value: p.talents.hp, keyPath: \.hp)
                    talentRow("+Crit%", value: p.talents.crit, keyPath: \.crit)
                }
            }
            .padding()
        }
        .navigationTitle("Hero")
    }

    private func talentRow(_ name: String, value: Int, keyPath: WritableKeyPath<Talents, Int>) -> some View {
        HStack {
            Text("\(name): \(value)")
            Spacer()
            Button("-") { playerVM.unallocateTalent(keyPath) }
            Button("+") { playerVM.allocateTalent(keyPath) }
        }
    }
}
