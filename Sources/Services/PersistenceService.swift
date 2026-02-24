import Foundation

final class PersistenceService {
    static let shared = PersistenceService()
    private let saveKey = "DL_RPG_Idle_V1.playerstate"

    func save(_ state: PlayerState) {
        do {
            let data = try JSONEncoder().encode(state)
            UserDefaults.standard.set(data, forKey: saveKey)
        } catch {
            print("Failed to save state: \(error)")
        }
    }

    func load() -> PlayerState {
        guard let data = UserDefaults.standard.data(forKey: saveKey) else {
            return .default
        }

        do {
            return try JSONDecoder().decode(PlayerState.self, from: data)
        } catch {
            print("Corrupt save detected, resetting to default: \(error)")
            return .default
        }
    }

    func reset() {
        UserDefaults.standard.removeObject(forKey: saveKey)
    }
}
