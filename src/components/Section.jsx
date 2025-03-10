import { useState } from "react";
import "../app.css"

const Section = ({ id, sectionName ,fields, previousData ,data, setData }) => {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setData((prev) => ({ ...prev, [id]: formData }));
  };

  return (
    <div className="border p-4 mb-4 text-primary1">
      <h2 className="text-xl font-bold text-alt1"> {sectionName}</h2>
      <table className="min-w-full">
        <thead>
          <tr className="">
          {fields.map((field) => (
            <th className="">{field.label}</th>
          ))}
          </tr>
        </thead>
        <tbody className="justify-center">
            {previousData.map((previous) => (
            <tr className="">
              {fields.map((field) => (
                  <td className="p-2 text-center">{previous[field.name]}</td>
                ))}
            </tr>
            ))}
          <tr>
          {fields.map((field) => (
          <td key={field.name} className="">
            {field.type === "text" && (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="border p-2 w-full"
                placeholder={field.placeholder}
              />
            )}
            {field.type === "select" && (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </td>
        ))}
        </tr>
        </tbody>
      </table>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Guardar Sección {id}
      </button>
    </div>
  );
};

export default Section;