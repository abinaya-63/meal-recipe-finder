const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_MEAL_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

// South Indian Meal List (For better search results)
const southIndianMeals = [
    "Lemon Rice", "Tomato Rice", "Curd Rice", "Mint Rice", "Potato Rice", "Mini Meals",
    "Full Meals", "Vegetable Biryani", "Veg Biryani", "Chicken Biryani", "Mutton Biryani", "Egg Biryani",
    "Fish Curry", "Chicken Gravy", "Rasam", "Sambar", "Pongal", "Idli", "Dosa", "Vada"
];

document.getElementById("searchBtn").addEventListener("click", async () => {
    const userInput = document.getElementById("searchInput").value;

    if (!userInput) {
        showError("Please enter a dish name.");
        return;
    }

    let found = false;

            found = await fetchRecipe(userInput);
        

    if (!found) showError("No South Indian recipes found! Try a different name.");
});

document.getElementById("randomBtn").addEventListener("click", fetchRandomMeal);

async function fetchRecipe(dish) {
    try {
        const response = await fetch(`${API_URL}${dish}`);
        const data = await response.json();

        if (data.meals) {
            displayRecipe(data.meals[0]);
            return true;
        }
    } catch (error) {
        showError("Error fetching recipe.");
    }
    return false;
}

async function fetchRandomMeal() {
    try {
        const response = await fetch(RANDOM_MEAL_URL);
        const data = await response.json();
        displayRecipe(data.meals[0]);
    } catch (error) {
        showError("Error fetching random meal.");
    }
}

function displayRecipe(meal) {
    document.getElementById("recipeContainer").innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Origin:</strong> ${meal.strArea}</p>
        <h3>Ingredients:</h3>
        <ul>${getIngredientsList(meal)}</ul>
        <h3>Instructions:</h3>
        <p class="recipe-details">${meal.strInstructions}</p>
        <button onclick="saveToFavorites('${meal.idMeal}', '${meal.strMeal}')">❤️ Save to Favorites</button>
    `;
}

function getIngredientsList(meal) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    return ingredients;
}

function showError(message) {
    document.getElementById("recipeContainer").innerHTML = `<p class="error">${message}</p>`;
}

// Save to LocalStorage
function saveToFavorites(mealId, mealName) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some(meal => meal.id === mealId)) {
        favorites.push({ id: mealId, name: mealName });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Recipe saved!");
    } else {
        alert("Already in favorites!");
    }

    displayFavorites();
}

// Display saved favorites
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteList = document.getElementById("favoriteRecipes");
    
    favoriteList.innerHTML = "";
    favorites.forEach(meal => {
        favoriteList.innerHTML += `<li>${meal.name} <button onclick="removeFromFavorites('${meal.id}')">❌</button></li>`;
    });
}

// Remove favorite
function removeFromFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(meal => meal.id !== mealId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Load favorites on page load
document.addEventListener("DOMContentLoaded", displayFavorites);
