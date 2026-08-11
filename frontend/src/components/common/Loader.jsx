export default function Loader({ text = "Chargement..." }) {
  return (
    <div className="loader-container">
      <div className="loader" />
      <span>{text}</span>
    </div>
  );
}