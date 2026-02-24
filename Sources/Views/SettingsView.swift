import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel
    @State private var showReset = false
    @State private var showDebug = false

    var body: some View {
        Form {
            Toggle("Sound", isOn: Binding(
                get: { playerVM.player.settings.soundEnabled },
                set: { playerVM.player.settings.soundEnabled = $0; playerVM.save() }
            ))
            Toggle("Vibration", isOn: Binding(
                get: { playerVM.player.settings.vibrationEnabled },
                set: { playerVM.player.settings.vibrationEnabled = $0; playerVM.save() }
            ))

            Button("Debug Panel") { showDebug.toggle() }
            Button("Reset Save", role: .destructive) { showReset = true }
        }
        .navigationTitle("Settings")
        .confirmationDialog("Reset all progress?", isPresented: $showReset) {
            Button("Reset", role: .destructive) { playerVM.resetSave() }
        }
        .sheet(isPresented: $showDebug) {
            DebugPanelView()
        }
    }
}

struct DebugPanelView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel

    var body: some View {
        VStack(spacing: 12) {
            Text("Debug Panel").font(.headline)
            Button("+100 Gold") {
                playerVM.player.gold += 100
                playerVM.save()
            }
            Button("+200 XP") {
                playerVM.gainRewards(xp: 200, gold: 0)
                playerVM.save()
            }
        }
        .padding()
    }
}
