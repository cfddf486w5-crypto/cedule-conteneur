import SwiftUI

struct InventoryView: View {
    @EnvironmentObject private var playerVM: PlayerViewModel
    @State private var selectedSlot: ItemSlot?
    @State private var selectedRarity: ItemRarity?
    @State private var selectedItem: Item?

    private let columns = [GridItem(.adaptive(minimum: 140))]

    var filteredItems: [Item] {
        playerVM.player.inventory.filter { item in
            (selectedSlot == nil || item.slot == selectedSlot) &&
            (selectedRarity == nil || item.rarity == selectedRarity)
        }
    }

    var body: some View {
        VStack {
            filterBar
            ScrollView {
                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(filteredItems) { item in
                        Button {
                            selectedItem = item
                        } label: {
                            VStack(alignment: .leading) {
                                Text(item.name).font(.caption.bold())
                                Text(item.rarity.rawValue.capitalized)
                                Text(item.slot.rawValue.capitalized)
                            }
                            .padding(8)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8))
                        }
                    }
                }
                .padding()
            }
        }
        .navigationTitle("Inventory")
        .sheet(item: $selectedItem) { item in
            VStack(spacing: 12) {
                Text(item.name).font(.headline)
                Text("Sell: \(item.sellValue)g")
                Button("Equip") {
                    playerVM.equipFromInventory(item)
                    selectedItem = nil
                }
                .buttonStyle(.borderedProminent)
                Button("Sell") {
                    playerVM.sellInventoryItem(item)
                    selectedItem = nil
                }
                .buttonStyle(.bordered)
            }
            .padding()
            .presentationDetents([.medium])
        }
    }

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                Menu("Slot") {
                    Button("All") { selectedSlot = nil }
                    ForEach(ItemSlot.allCases) { slot in
                        Button(slot.rawValue.capitalized) { selectedSlot = slot }
                    }
                }
                Menu("Rarity") {
                    Button("All") { selectedRarity = nil }
                    ForEach(ItemRarity.allCases) { rarity in
                        Button(rarity.rawValue.capitalized) { selectedRarity = rarity }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}
