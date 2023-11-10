const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await response.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
};

async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const respData = await resp.json();

    const meal = respData.meals[0];

    return meal;
};

async function getMealsBySearch(term) {
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
};

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
        ${random ? `<span class="random">Random Recipe</span>` : ''}
            <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");
    
    btn.addEventListener('click', function() {
        if (btn.classList.contains("active")) {
            removeMealsLocalStorage(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealsLocalStorage(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });
    
    meals.appendChild(meal);
}

function addMealsLocalStorage(mealId) {
    const mealIds = getMealsLocalStorage();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealsLocalStorage(mealId) {
    const mealIds = getMealsLocalStorage();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLocalStorage(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    // clean the container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLocalStorage();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        let meal = await getMealById(mealId);

        addMealFav(meal);
    }
}

function addMealFav(mealData){
    const favMeal = document.createElement("li");
    favMeal.setAttribute('title', mealData.strMeal);

    favMeal.innerHTML = `
        <img 
            src="${mealData.strMealThumb}" 
            alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class="clear"><i class="fa-solid fa-rectangle-xmark" style="color: #000000;"></i></button>`;

        const btn = favMeal.querySelector('.clear');

        btn.addEventListener('click', function() {
            removeMealsLocalStorage(mealData.idMeal);

            fetchFavMeals();
        });
    
    favoriteContainer.appendChild(favMeal);
}