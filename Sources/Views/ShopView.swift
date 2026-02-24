import SwiftUI

struct ShopView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel
    @State private var refreshStamp = Date()

    var body: some View {
        VStack(spacing: 14) {
            Text("Gold: \(playerVM.player.gold)").font(.headline)
            Text("Potions: \(playerVM.player.potions)")

            Button("Buy Potion (30g)") { playerVM.buyPotion() }
                .buttonStyle(.bordered)
            Button("Buy Chest (100g)") { playerVM.buyChest() }
                .buttonStyle(.borderedProminent)
            Button("Refresh Shop") { refreshStamp = Date() }

            Text("Refreshed: \(refreshStamp.formatted(date: .omitted, time: .standard))")
                .font(.caption)
        }
        .padding()
        .navigationTitle("Shop")
    }
}
