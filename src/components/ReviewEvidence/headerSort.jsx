const HeaderSort = ({ column, handleSort, sortBy, order }) => {
    return (
        <th className="w-3/10 py-3 px-4 text-left cursor-pointer"
            onClick={() => handleSort(column)}
        >{column} {sortBy === column ? (order === "asc" ? "▲" : "▼") : ""}</th>
    );
}

export default HeaderSort;