import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";

function CrearCategoriaForm({ onCancel, onSaved, frame_id }) {
    const [nombre, setNombre] = useState("");
    const handleSave = async () => {
      try {
        const res = await api.post("/api/category", { category_name: nombre, frame_id: frame_id });
        onSaved();
      } catch (err) {
        alert("Error al guardar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Crear Categoría</h2>
        <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la categoría
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function ModificarCategoriaForm({ category, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(category.category_name);
  
    const handleSave = async () => {
      try {
        await api.put("/api/category-update", {
          category_id: category.category_id,
          category_name: nombre
        });
        onSaved();
      } catch (err) {
        alert("Error al actualizar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Modificar Categoría</h2>
        <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la categoría
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function CrearSeccionForm({ onCancel, onSaved, category_id }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSave = async () => {
      try {
        const res = await api.post("/api/section", { section_name: nombre, category_id: category_id, section_description: descripcion });
        onSaved();
      } catch (err) {
        alert("Error al guardar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Crear Sección</h2>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la sección
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Nombre de la seccion"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label htmlFor="descripcionSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la sección
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Descripcion de la seccion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function ModificarSeccionForm({ seccion, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(seccion.section_name);
    const [descripcion, setDescripcion] = useState(seccion.section_description);
  
    const handleSave = async () => {
      try {
        await api.put("/api/section-update", {
          section_id: seccion.section_id,
          section_name: nombre,
          section_description: descripcion
        });
        onSaved();
      } catch (err) {
        alert("Error al actualizar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Modificar Categoria</h2>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la sección
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label htmlFor="descripcionSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la sección
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function CrearCriterioForm({ onCancel, onSaved, section_id }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [is_transversal, setTrasnversal] = useState(false);
    const [help, setHelp] = useState("");

    const handleSave = async () => {
      try {
        const res = await api.post("/api/standard", { standard_name: nombre, section_id: section_id, standard_description: descripcion, is_transversal: is_transversal, help: help });
        onSaved();
      } catch (err) {
        alert("Error al guardar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Crear Criterio</h2>
        <label htmlFor="nombreCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del criterio
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Nombre del criterio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label htmlFor="descripcionCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del criterio
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Descripcion del criterio"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
        />
        <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={is_transversal} onChange={(e) => setTrasnversal(e.target.checked)}/> Transversal
        </label>
        <label htmlFor="AyudaCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Ayuda del criterio
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Ayuda del criterio"
            value={help}
            onChange={(e) => setHelp(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }
  
  function ModificarCriterioForm({ criterio, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(criterio.standard_name);
    const [descripcion, setDescripcion] = useState(criterio.standard_description);
    const [is_transversal, setTrasnversal] = useState(criterio.is_transversal);
    const [help, setHelp] = useState(criterio.help);
  
    const handleSave = async () => {
      try {
        await api.put("/api/standard-update", {
          standard_id: criterio.standard_id,
          standard_name: nombre,
          standard_description: descripcion,
          is_transversal: is_transversal,
          help: help
        });
        onSaved();
      } catch (err) {
        alert("Error al actualizar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Modificar Criterio</h2>
        <label htmlFor="nombreCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del criterio
        </label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label htmlFor="descripcionCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del criterio
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
        />
        <label className="flex items-center">
            <input type="checkbox" className="mr-2" checked={is_transversal} onChange={(e) => setTrasnversal(e.target.checked)}/> Transversal
        </label>
        <label htmlFor="AyudaCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Ayuda del criterio
        </label>
        <input
            type="text"
            className="border p-2 w-full mb-2"
            value={help}
            onChange={(e) => setHelp(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

export default function EstructuraMarco() {
    const { id } = useParams();
    const location = useLocation();
    const marco = location.state?.marco;
  
    const [categorias, setCategorias] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [criterios, setCriterios] = useState([]);
  
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

    const [showCreateCategoria, setShowCreateCategoria] = useState(false);
    const [showCreateSeccion, setShowCreateSeccion] = useState(false);
    const [showCreateCriterio, setShowCreateCriterio] = useState(false);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingCriterioId, setEditingCriterioId] = useState(null);
  
    useEffect(() => {
      fetchCategorias();
    }, [id]);
  
    const fetchCategorias = async () => {
      try {
        const res = await api.post(`/api/categories`, {frame_id: marco.frame_id});
        setCategorias(res.data);
        setSecciones([]);
        setCriterios([]);
        setCategoriaSeleccionada(null);
        setSeccionSeleccionada(null);
      } catch (err) {
        alert("Error al cargar categorías");
      }
    };
  
    const fetchSecciones = async (categoriaId) => {
      try {
        const res = await api.post(`/api/sections`, {category_id: categoriaId});
        setSecciones(res.data);
        setCriterios([]);
        setSeccionSeleccionada(null);
      } catch (err) {
        alert("Error al cargar secciones");
      }
    };
  
    const fetchCriterios = async (seccionId) => {
      try {
        const res = await api.post(`/api/standards`, {section_id: seccionId});
        setCriterios(res.data);
      } catch (err) {
        alert("Error al cargar criterios");
      }
    };

    const handleOpenCreateCategoria = () => {
        setShowCreateCategoria(true);
        setShowCreateSeccion(false);
        setShowCreateCriterio(false);
    };

    const handleOpenCreateSeccion = () => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(true);
        setShowCreateCriterio(false);
    };

    const handleOpenCreateCriterio = () => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(false);
        setShowCreateCriterio(true);
    };

    const handleCancel = () => {
      setEditingCategoryId(null);
      setEditingSectionId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditCategoria = (categoryId) => {
      setEditingCategoryId(categoryId);
      setEditingSectionId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditSeccion = (seccionId) => {
      setEditingSectionId(seccionId);
      setEditingCategoryId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditCriterio = (criterioId) => {
      setEditingSectionId(criterioId);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };
  
    return (
        <>
      <AppHeader />
      <SubHeading />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Estructura del {marco.frame_name}</h1>
  
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Categorías</h2>
          <button className="bg-green-600 text-white px-3 py-1 rounded mb-2" onClick={handleOpenCreateCategoria}>Crear Categoría</button>
          {showCreateCategoria && (
          <CrearCategoriaForm onCancel={handleCancel} onSaved={() => { handleCancel(); fetchCategorias(); }} frame_id={marco.frame_id} />
        )}
          <ul className="space-y-1">
            {categorias.map((cat) => (
              <li
              key={cat.category_id}
              onClick={() => {
                setCategoriaSeleccionada(cat);
                fetchSecciones(cat.category_id);
              }}
              className={`cursor-pointer px-2 py-1 rounded ${
                categoriaSeleccionada?.category_id === cat.category_id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              {cat.indice}.
              {cat.category_name}
              <button 
                className="ml-2 text-sm text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEditCategoria(cat.category_id);
                }}
              >
                Modificar
              </button>
              {editingCategoryId === cat.category_id && (
                <ModificarCategoriaForm 
                  category={cat}
                  onCancel={handleCancel}
                  onSaved={() => {
                    handleCancel();
                    fetchCategorias();
                  }}
                />
              )}
            </li>
            ))}
          </ul>
        </div>
  
        {categoriaSeleccionada && (
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Secciones de "{categoriaSeleccionada.category_name}"</h2>
            <button className="bg-green-600 text-white px-3 py-1 rounded mb-2" onClick={handleOpenCreateSeccion}>Crear Sección</button>
            {showCreateSeccion && (
          <CrearSeccionForm onCancel={handleCancel} onSaved={() => { handleCancel(); fetchSecciones(); }} category_id={categoriaSeleccionada.category_id} />)}
            <ul className="space-y-1">
              {secciones.map((sec) => (
                <li
                  key={sec.section_id}
                  onClick={() => {
                    setSeccionSeleccionada(sec);
                    fetchCriterios(sec.section_id);
                  }}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    seccionSeleccionada?.id === sec.section_id ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  {categoriaSeleccionada.indice}.{sec.indice}.
                  {sec.section_name}
                  <button 
                    className="ml-2 text-sm text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditSeccion(sec.section_id);
                    }}
                  >
                    Modificar
                  </button>
                {editingSectionId === sec.section_id && (
                  <ModificarSeccionForm 
                    seccion={sec}
                    onCancel={handleCancel}
                    onSaved={() => {
                      handleCancel();
                      fetchSecciones();
                    }}
                  />
                )}
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {seccionSeleccionada && (
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Criterios de "{seccionSeleccionada.section_name}"</h2>
            <button className="bg-green-600 text-white px-3 py-1 rounded mb-2" onClick={handleOpenCreateCriterio}>Crear Criterio</button>
            {showCreateCriterio && (
          <CrearCriterioForm onCancel={handleCancel} onSaved={() => { handleCancel(); fetchCriterios(); }} section_id={seccionSeleccionada.section_id} />
        )}
            <ul className="space-y-1">
              {criterios.map((cri) => (
                <li key={cri.id} className="px-2 py-1 rounded hover:bg-gray-100">
                  {categoriaSeleccionada.indice}.{seccionSeleccionada.indice}.{cri.indice}.
                  {cri.standard_name}
                  <button 
                    className="ml-2 text-sm text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditCriterio(cri.standard_id);
                    }}
                  >
                    Modificar
                  </button>
                {editingSectionId === cri.standard_id && (
                  <ModificarCriterioForm 
                    criterio={cri}
                    onCancel={handleCancel}
                    onSaved={() => {
                      handleCancel();
                      fetchSecciones();
                    }}
                  />
                )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <AppFooter />
    </>
    );
  }