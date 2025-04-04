import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecipesPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = "https://baking-ai.onrender.com/get-all-recipes";
<<<<<<< HEAD
const ITEMS_PER_PAGE = 20;
=======
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
<<<<<<< HEAD
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    if (!isSearchActive) {
      fetchRecipes(page);
    }
  }, [page]);

  useEffect(() => {
    if (isSearchActive) {
      paginateFilteredRecipes();
    }
  }, [page, filteredRecipes]);
=======

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8

  const fetchRecipes = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const response = await axios.get(`${BASE_URL}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`);
      const data = response.data;
      if (data && data.recipes.length > 0) {
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes);
        const calculatedTotalPages = data.total_pages || Math.ceil(data.total_recipes / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);
=======
      const response = await axios.get(`${BASE_URL}?page=${pageNumber}&limit=20`);
      const data = response.data;

      if (data && data.recipes.length > 0) {
        setRecipes(data.recipes);
        setTotalPages(data.total_pages || Math.ceil(data.total_recipes / 20));
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8
      } else {
        setRecipes([]);
        setError("No recipes available for this page.");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const fetchAllRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}?page=1&limit=1000`);
      return response.data.recipes || [];
    } catch (error) {
      console.error("Failed to fetch all recipes");
      return [];
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      setPage(1);
      fetchRecipes(1);
      return;
    }

    setLoading(true);
    const allRecipes = await fetchAllRecipes();
    const filtered = allRecipes.filter((recipe) =>
      recipe.Ingredients?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setIsSearchActive(true);
    setPage(1); // Reset to page 1 for new search

    if (filtered.length === 0) {
      setFilteredRecipes([]);
      setTotalPages(1);
      setError("No recipes found for the given ingredient.");
    } else {
      setFilteredRecipes(filtered);
      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
      setError(null);
    }

    setLoading(false);
  };

  const paginateFilteredRecipes = () => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setRecipes(filteredRecipes.slice(start, end));
  };

=======
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDirections(false);
  };

  const calculateTotalGrams = (ingredients) => {
    if (!Array.isArray(ingredients)) return "N/A";
    return ingredients.reduce((total, item) => {
      const match = item.match(/=\s?(\d+(\.\d+)?)g/);
      return match ? total + parseFloat(match[1]) : total;
    }, 0);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-warning display-4 mb-4">Delicious Recipes</h1>
<<<<<<< HEAD

      {/* Search Box */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search by ingredient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <br />

=======
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8
      {error && <p className="alert alert-danger">{error}</p>}

      {loading ? (
        <p className="text-center text-info">Loading recipes...</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-2">
          {recipes.map((recipe, index) => (
            <div key={index} className="col">
              <div className="card border-warning shadow-lg recipe-card">
                <img
                  src={recipe.Image || "fallback-image.jpg"}
                  alt={recipe["Recipe Name"] || "Unnamed Recipe"}
                  className="card-img-top rounded-top"
                />
                <div className="card-body d-flex flex-column justify-content-between p-2">
                  <h5 className="card-title mb-2">{recipe["Recipe Name"] || "Unnamed Recipe"}</h5>
                  <button onClick={() => handleRecipeClick(recipe)} className="btn btn-warning w-100 m-0">
                    See Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-warning mx-2" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span className="text-light">Page {page} of {totalPages}</span>
<<<<<<< HEAD
        <button
          className="btn btn-warning mx-2"
          onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : totalPages))}
          disabled={page >= totalPages}
        >
=======
        <button className="btn btn-warning mx-2" onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : totalPages))} disabled={page >= totalPages}>
>>>>>>> 58eb0d5aedde894284acc4adbacdb76ce5fb48c8
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedRecipe && (
        <div className="modal-overlay d-flex align-items-center justify-content-center">
          <div className="modal-content bg-dark p-4 rounded shadow-lg border border-warning">
            <h2 className="text-warning">{selectedRecipe["Recipe Name"]}</h2>
            <p className="text-light"><strong>Cook Time:</strong> {selectedRecipe["Cook Time"] || "N/A"}</p>
            <p className="text-light"><strong>Prep Time:</strong> {selectedRecipe["Prep Time"] || "N/A"}</p>
            <p className="text-light"><strong>Ingredients:</strong> {selectedRecipe.Ingredients || "N/A"}</p>
            <p className="text-light"><strong>Grams:</strong> {selectedRecipe["Converted Ingredients"]?.join(", ") || "N/A"}</p>
            <p className="text-light"><strong>Total Grams:</strong> {calculateTotalGrams(selectedRecipe["Converted Ingredients"])}g</p>
            {showDirections ? (
              <p className="text-warning"><strong>Directions:</strong> {selectedRecipe.Directions || "N/A"}</p>
            ) : (
              <button onClick={() => setShowDirections(true)} className="btn btn-warning my-2">
                Show More
              </button>
            )}
            <button className="btn btn-danger w-100" onClick={() => setSelectedRecipe(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;