import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecipesPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes

  const fetchRecipes = async (pageNumber) => {
    setLoading(true);
    setError(null);

    try {
      // const response = await axios.get(
      //   `http://localhost:8080/get-all-recipes?page=${pageNumber}&limit=20`
      // );

      const response = await axios.get(
        `https://baking-ai.onrender.com/get-all-recipes`
      );


      // const response = await axios.get(
      //   `https://8d53-2401-4900-5558-f60c-f446-5f5c-dbc1-a12f.ngrok-free.app`
      // );


      if (response.data && response.data.recipes.length > 0) {
        setRecipes(response.data.recipes);
        setFilteredRecipes(response.data.recipes); // Initialize filtered recipes
        const calculatedTotalPages =
          response.data.total_pages || Math.ceil(response.data.total_recipes / 20);
        setTotalPages(calculatedTotalPages);
      } else {
        setRecipes([]);
        setFilteredRecipes([]);
        setError("No recipes available for this page.");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

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

  const closeModal = () => setSelectedRecipe(null);

  // Filter recipes based on the search query
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes); // Reset to all recipes if search query is empty
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe.Ingredients?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      setError("No recipes found for the given ingredient.");
    } else {
      setError(null);
    }

    setFilteredRecipes(filtered);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-black display-4 mb-4">Delicious Recipes</h1>

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


      {error && <p className="alert alert-danger">{error}</p>}

      {loading ? (
        <p className="text-center text-info">Loading recipes...</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-2">
          {filteredRecipes.map((recipe, index) => (
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

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-warning mx-2"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-light">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-warning mx-2"
          onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

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
            <button className="btn btn-danger w-100" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
