function InventoryCard({ item = {} }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold">{item.name || "Naam niet beschikbaar"}</h2>
            <p><strong>Voorraad:</strong> {item.quantity ? `${item.quantity} stuks` : "Niet beschikbaar"}</p>
            <p><strong>Categorie:</strong> {item.category || "Geen categorie"}</p>
            <p><strong>Locatie:</strong> {item.location || "Onbekend"}</p>
            <p className={`font-semibold ${item.status ? "text-green-600" : "text-red-600"}`}>
                {item.status ? "Actief" : "Niet Actief"}
            </p>
        </div>
    );
}

export default InventoryCard;