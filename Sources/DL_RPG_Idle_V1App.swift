import SwiftUI

@main
struct DL_RPG_Idle_V1App: App {
    @StateObject private var playerVM = PlayerViewModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(playerVM)
        }
    }
}
