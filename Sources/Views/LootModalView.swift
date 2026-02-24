import SwiftUI

struct LootModalView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel
    @Environment(\.dismiss) private var dismiss
    let item: Item

    var body: some View {
        VStack(spacing: 12) {
            Text("Loot Found!").font(.title3.bold())
            Text(item.name).font(.headline)
            Text("\(item.rarity.rawValue.capitalized) • \(item.slot.rawValue.capitalized)")
            Text("Sell: \(item.sellValue)g")
            statText

            HStack {
                Button("Equip") { playerVM.equip(item); dismiss() }
                    .buttonStyle(.borderedProminent)
                Button("Keep") { playerVM.keep(item); dismiss() }
                    .buttonStyle(.bordered)
                Button("Sell") { playerVM.sell(item); dismiss() }
                    .buttonStyle(.bordered)
            }
            Button("Close") { dismiss() }
                .font(.caption)
        }
        .padding()
        .presentationDetents([.medium])
    }

    private var statText: some View {
        VStack {
            if item.stats.atk > 0 { Text("ATK +\(Int(item.stats.atk))") }
            if item.stats.hp > 0 { Text("HP +\(Int(item.stats.hp))") }
            if item.stats.def > 0 { Text("DEF +\(String(format: \"%.1f\", item.stats.def))") }
            if item.stats.critChance > 0 { Text("Crit +\(Int(item.stats.critChance * 100))%") }
            if item.stats.attackSpeed > 1.0 { Text("Speed +\(String(format: \"%.2f\", item.stats.attackSpeed - 1.0))") }
        }
        .font(.caption)
    }
}
