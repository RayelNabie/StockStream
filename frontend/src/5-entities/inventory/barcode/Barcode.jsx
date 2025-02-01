export default function Barcode({ value }) {
  if (!/^\d+$/.test(value)) {
    return <p className="text-red-500">Barcode kan alleen cijfers bevatten</p>;
  }

  const generateBarcode = (value) => {
    return value.split("").map((digit, index) => {
      const width = parseInt(digit) % 2 === 0 ? "4px" : "2px";
      return (
        <div
          key={index}
          style={{
            display: "inline-block",
            width,
            height: "50px",
            backgroundColor: index % 2 === 0 ? "black" : "white",
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">{generateBarcode(value)}</div>
      <p className="text-sm mt-2">{value}</p>
    </div>
  );
}