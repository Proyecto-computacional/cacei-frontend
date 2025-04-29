const CriteriaGuide = ({ onClose, help }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-[500px] bg-white shadow-lg rounded-lg border border-gray-300 p-6">
        <h2 className="text-2xl font-bold text-black mb-2">Guía de criterio X.X</h2>
        <p className="bg-gray-100 p-4 rounded-md text-gray-600 text-sm mb-4">
          {help}
        </p>
        <div className="flex justify-center">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriteriaGuide;