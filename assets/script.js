const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealInfoEl = document.getElementById('meal-info');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

        const respData = await response.json();
        const randomMeal = respData.meals[0];
    
        console.log(randomMeal);
    
        addMeal(randomMeal, true);
    } catch (e) {
        console.log(e);
    }
};

async function getMealById(id) {
    try {
        const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

        const respData = await resp.json();
    
        const meal = respData.meals[0];
    
        return meal;
    } catch (e) {
        console.log(e);
    }
};

async function getMealsBySearch(term) {
    try {
        const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

        const respData = await resp.json();
        const meals = respData.meals;
    
        return meals;
    } catch (e) {
        console.log(e);
    }
};

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
        ${random ? `<span class="random">Random Recipe</span>` : ''}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");
    
    btn.addEventListener('click', function(event) {
        event.stopPropagation();

        if (btn.classList.contains("active")) {
            removeMealsLocalStorage(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealsLocalStorage(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });

    meal.addEventListener('click', function() {
        showMealInfo(mealData);
    });
    
    mealsEl.appendChild(meal);
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
    try {
        favoriteContainer.innerHTML = "";

        const mealIds = getMealsLocalStorage();

        for (let i = 0; i < mealIds.length; i++) {
            const mealId = mealIds[i];
            let meal = await getMealById(mealId);

            addMealFav(meal);
        }

    } catch (e) {
        console.log(e);
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

        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            
            removeMealsLocalStorage(mealData.idMeal);

            fetchFavMeals();
        });

        favMeal.addEventListener('click', function() {
            showMealInfo(mealData);
        });
    
    favoriteContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async function() {
    try {
        mealsEl.innerHTML = "";
        const search = searchTerm.value;
    
        const meals = await getMealsBySearch(search);
    
        if (meals) {
            meals.forEach(meal => {
                addMeal(meal);
            });
        }
    } catch (e) {
        console.log(e);
    }
});

function showMealInfo(mealData) {

    mealInfoEl.innerHTML = '';

    const mealEl = document.createElement('div');
    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        if(mealData['strIngredient' + i]) {
            ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`);
        } else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
    `

    mealInfoEl.appendChild(mealEl);

    mealPopup.classList.remove('hidden');
}

popupCloseBtn.addEventListener('click', function() {
    mealPopup.classList.add("hidden");
});
