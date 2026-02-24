import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                header

                if playerVM.player.activeRun != nil {
                    NavigationLink("Continue Run") {
                        CombatView()
                    }
                    .buttonStyle(.borderedProminent)
                }

                ForEach(availableZones, id: \.id) { zone in
                    Button("New Run: \(zone.displayName)") {
                        playerVM.startRun(zone: zone)
                    }
                    .buttonStyle(.bordered)
                }

                NavigationLink("Hero") { HeroView() }
                NavigationLink("Inventory") { InventoryView() }
                NavigationLink("Shop") { ShopView() }
                NavigationLink("Settings") { SettingsView() }
            }
            .padding()
        }
        .navigationTitle("Idle RPG")
        .background(LinearGradient(colors: [.green.opacity(0.12), .clear], startPoint: .top, endPoint: .bottom))
    }

    private var availableZones: [Zone] {
        Zone.allCases.filter { playerVM.player.unlockedZones.contains($0.id) }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Hero Lv. \(playerVM.player.level)").font(.headline)
            Text("Gold: \(playerVM.player.gold)")
            Text("Unlocked Zone: \(availableZones.map(\.displayName).joined(separator: ", "))")
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 14))
    }
}
