import SwiftUI

struct RootView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel

    var body: some View {
        TabView {
            NavigationStack { HomeView() }
                .tabItem { Label("Home", systemImage: "house") }

            NavigationStack { HeroView() }
                .tabItem { Label("Hero", systemImage: "person") }

            NavigationStack { InventoryView() }
                .tabItem { Label("Inventory", systemImage: "bag") }

            NavigationStack { ShopView() }
                .tabItem { Label("Shop", systemImage: "cart") }

            NavigationStack { SettingsView() }
                .tabItem { Label("Settings", systemImage: "gear") }
        }
        .tint(.green)
        .onAppear { playerVM.save() }
    }
}
