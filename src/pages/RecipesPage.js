import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecipesPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

const BASE_URL = "https://baking-ai.onrender.com/get-all-recipes";
const ITEMS_PER_PAGE = 24;
// page num updated 20

const SkeletonCard = () => {
  return (
    <div className="recipe-card skeleton-card border border-warning shadow-lg">
      <div className="skeleton-img" />
      <div className="card-body p-2">
        <div className="skeleton-text title"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
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

  useEffect(() => {
    if (selectedRecipe) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [selectedRecipe]);

  const fetchRecipes = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`);
      const data = response.data;
      if (data && data.recipes.length > 0) {
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes);
        const calculatedTotalPages = data.total_pages || Math.ceil(data.total_recipes / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);
      } else {
        setRecipes([]);
        setFilteredRecipes([]);
        setError("No recipes found for the given ingredient.");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
    setPage(1);

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

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDirections(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const calculateTotalGrams = (ingredients) => {
    if (!Array.isArray(ingredients)) return "N/A";
    return ingredients.reduce((total, item) => {
      const match = item.match(/=\s?(\d+(\.\d+)?)g/);
      return match ? total + parseFloat(match[1]) : total;
    }, 0);
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-warning display-4 mb-4">Delicious Recipes</h1>

      <div className="search-container d-flex flex-wrap gap-2">
        <input
          type="text"
          className="search-box"
          placeholder="Search by ingredient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-warning" onClick={handleSearch}>
          Search
        </button>
        <button
          className="btn btn-outline-warning text-light"
          onClick={() => {
            setSearchQuery("");
            setIsSearchActive(false);
            setPage(1);
            fetchRecipes(1);
          }}
        >
          Clear
        </button>
      </div>
      <br />

      {error && (
        <div className="empty-state text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486790.png"
            alt="No results"
            className="empty-img"
            style={{ width: "160px", height: "auto", maxWidth: "90%" }}
          />
          <h4 className="text-warning mt-3">Oops! No recipes found 😕</h4>
          <p className="text-light">Try searching with a different ingredient or check your spelling.</p>
        </div>
      )}

      <div className="card-container">
        {loading
          ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          : recipes.map((recipe, index) => (
              <div key={index} className="recipe-card border border-warning shadow-lg">
                <img
                  src={recipe.Image || "fallback-image.jpg"}
                  alt={recipe["Recipe Name"] || "Unnamed Recipe"}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column justify-content-between p-2">
                  <h5 className="card-title mb-2">{recipe["Recipe Name"] || "Unnamed Recipe"}</h5>
                  <button
                    onClick={() => handleRecipeClick(recipe)}
                    className="btn btn-warning w-100 m-0"
                  >
                    See Recipe
                  </button>
                </div>
              </div>
            ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link bg-warning border-0 text-dark"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link bg-warning border-0 text-dark"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link bg-warning border-0 text-dark"}
          activeClassName={"active"}
          forcePage={page - 1}
        />
      </div>

      {selectedRecipe && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content border border-warning" onClick={(e) => e.stopPropagation()}>
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
            <button className="btn btn-danger w-100" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;