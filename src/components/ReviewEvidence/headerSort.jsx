const HeaderSort = ({ column, text, handleSort, sortBy, order }) => {
    return (
        <th rowSpan={2} className="w-3/10 py-3 px-4 text-left cursor-pointer"
            onClick={() => handleSort(column)}
        >{text} {sortBy === column ? (order === "asc" ? "▲" : "▼") : ""}</th>
    );
}

export default HeaderSort;