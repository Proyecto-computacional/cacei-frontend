const CvRecords = (registros, section2) => {
    console.log(section2);
    return (
        registros[section2.id]?.map((previous, index) => (
            <tr key={index}>
                {section2.campos.map((field) => (
                    <td key={field.name} className="p-2 text-center">
                        {previous[field.name] || "-"} { }
                    </td>
                ))}
            </tr>
        ))
    )
}

export default CvRecords;