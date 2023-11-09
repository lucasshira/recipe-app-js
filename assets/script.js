const meals = document.getElementById('meals');

getRandomMeal();

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await response.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
};

async function getMealById(id) {
    const meal = await fetch('www.themealdb.com/api/json/v1/1/lookup.php?i=52772' + id);
};

async function getMealsBySearch(term) {
    const meals = await fetch('www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata' + term);
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