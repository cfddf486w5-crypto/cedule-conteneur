import Foundation

enum ItemSlot: String, Codable, CaseIterable, Identifiable {
    case weapon
    case armor
    case ring

    var id: String { rawValue }
}

enum ItemRarity: String, Codable, CaseIterable, Identifiable {
    case common
    case rare
    case epic
    case legendary

    var id: String { rawValue }

    var multiplier: Double {
        switch self {
        case .common: return 1.0
        case .rare: return 1.3
        case .epic: return 1.7
        case .legendary: return 2.3
        }
    }
}

struct Stats: Codable {
    var hp: Double = 0
    var atk: Double = 0
    var def: Double = 0
    var critChance: Double = 0
    var critDamage: Double = 1.5
    var attackSpeed: Double = 1.0

    static let heroBase = Stats(hp: 100, atk: 10, def: 2, critChance: 0.05, critDamage: 1.5, attackSpeed: 1.0)

    static func + (lhs: Stats, rhs: Stats) -> Stats {
        Stats(
            hp: lhs.hp + rhs.hp,
            atk: lhs.atk + rhs.atk,
            def: lhs.def + rhs.def,
            critChance: lhs.critChance + rhs.critChance,
            critDamage: lhs.critDamage,
            attackSpeed: lhs.attackSpeed + rhs.attackSpeed
        )
    }
}

struct Item: Codable, Identifiable, Equatable {
    let id: UUID
    var name: String
    var slot: ItemSlot
    var rarity: ItemRarity
    var levelFound: Int
    var stats: Stats
    var sellValue: Int
}

struct Enemy: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var maxHP: Double
    var atk: Double
    var def: Double
    var xpReward: Int
    var goldReward: Int
    var special: String?
}

struct Talents: Codable {
    var atk: Int = 0
    var hp: Int = 0
    var crit: Int = 0
}

struct GameSettings: Codable {
    var soundEnabled: Bool = true
    var vibrationEnabled: Bool = true
}

struct RunState: Codable {
    var zoneId: String
    var stage: Int
    var currentEnemy: Enemy
    var heroCurrentHP: Double
    var enemyCurrentHP: Double
    var cooldownRemaining: Int
    var stunTicksRemaining: Int
    var potionUsedThisFight: Bool
    var fightsWon: Int
}

struct EquippedItems: Codable {
    var weapon: Item?
    var armor: Item?
    var ring: Item?

    func item(for slot: ItemSlot) -> Item? {
        switch slot {
        case .weapon: return weapon
        case .armor: return armor
        case .ring: return ring
        }
    }

    mutating func set(item: Item?, for slot: ItemSlot) {
        switch slot {
        case .weapon: weapon = item
        case .armor: armor = item
        case .ring: ring = item
        }
    }

    var all: [Item] {
        [weapon, armor, ring].compactMap { $0 }
    }
}

struct PlayerState: Codable {
    var level: Int
    var xp: Int
    var xpNeeded: Int
    var gold: Int
    var baseStats: Stats
    var talentPoints: Int
    var talents: Talents
    var inventory: [Item]
    var equipped: EquippedItems
    var potions: Int
    var unlockedZones: [String]
    var settings: GameSettings
    var activeRun: RunState?

    static var `default`: PlayerState {
        PlayerState(
            level: 1,
            xp: 0,
            xpNeeded: Formula.xpNeeded(for: 1),
            gold: 100,
            baseStats: .heroBase,
            talentPoints: 0,
            talents: Talents(),
            inventory: [],
            equipped: EquippedItems(),
            potions: 1,
            unlockedZones: [Zone.forest.id],
            settings: GameSettings(),
            activeRun: nil
        )
    }
}

enum Zone: String, CaseIterable, Codable, Identifiable {
    case forest
    case ruins

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .forest: return "Forest"
        case .ruins: return "Ruins"
        }
    }
}
