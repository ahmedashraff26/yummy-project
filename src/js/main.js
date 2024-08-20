"use strict"



function openNav() {
    $(".side-nav").animate({
        left: 0
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeNav() {
    let boxWidth = $(".side-nav .nav-tab").outerWidth()
    $(".side-nav").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

$(".open-close-icon").on('click', function () {
    if ($(".side-nav").css("left") == "0px") {
        closeNav();
    } else {
        openNav();
    }
})

async function getData() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let data = await response.json();
    console.log(data);
    console.log(data.meals);
    displayData(data.meals.slice(0, 20));
}
getData();

function displayData(data) {
    let cartoona = "";
    $("#rowData").addClass('grid-cols-4');
    $("#rowData").removeClass('grid-cols-12');
    for (let i = 0; i < data.length; i++) {
        cartoona += `<div onclick="getDetails(${data[i].idMeal})" class="col-span-3 md:col-span-1 group">
                <div class="meal relative overflow-hidden rounded-lg cursor-pointer">
                    <img class="w-full" src="${data[i].strMealThumb}" alt="">
                    <div class="meal-layer absolute inset-0 top-full flex items-center ps-3 overflow-hidden bg-[#f9f6f6ca] group-hover:top-0 duration-500">
                        <h3 class="text-3xl text-black">${data[i].strMeal}</h3>
                    </div>
                </div>
            </div>`
    }
    $("#rowData").html(cartoona);
}


async function getDetails(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let details = await response.json();
    console.log(details.meals);
    let i = 1;
    let x = `strIngredient${i}`;
    displayDetails(details.meals[0])
}

function displayDetails(meal) {
    $("#rowData").removeClass('grid-cols-4');
    $("#rowData").addClass('grid-cols-12');
    let ingredients = "";
    let tags = "";
    let tagLists = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="bg-blue-100 text-blue-700 m-1 p-1 rounded">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    if (meal.strTags) {
        tags = meal.strTags.split(",")
    }
    console.log(tags);
    if (!tags) {
        tags = [];
    }
    for (let i = 0; i < tags.length; i++) {
        tagLists += `<li class="bg-red-100 text-red-700 my-8 p-1 rounded">${tags[i]}</li>`
    }
    let cartoona = `<div class="col-span-4 text-white">
                <img class="w-full rounded-3xl" src="${meal.strMealThumb}" alt="">
                <h2 class="text-lg font-bold">${meal.strMeal}</h2>
              </div>
              <div class="col-span-8 text-white">
                <h2 class="text-lg font-bold">Instructions</h2>
                <p class="text-white pb-7">
                  ${meal.strInstructions}
                </p>
                <h3 class="font-bold text-3xl"><span class="font-bold">Area : </span>Turkish</h3>
                <h3 class="font-bold text-3xl py-2"><span class="font-bold">Category : </span>Side</h3>
                <h3 class="font-bold text-3xl">Recipes:</h3>
                <ul class="list-none flex flex-wrap gap-2 py-6">
                  ${ingredients}
                </ul>
            
                <h3 class="text-3xl font-bold">Tags:</h3>
                <ul class="list-none flex flex-wrap gap-2">
                  ${tagLists}
                </ul>
            
                <div class="flex gap-2">
                  <a target="_blank" href="${meal.strSource}" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Source</a>
                  <a target="_blank" href="${meal.strYoutube}" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Youtube</a>
                </div>
              </div>`
    $("#rowData").html(cartoona);
}

async function getCategories() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await response.json();
    console.log(data.categories);
    displayCategories(data.categories)
}

$("#categories").on('click', function () {
    closeNav();
    $('#searchData').html("");
    getCategories();
})


function displayCategories(categories) {
    $("#rowData").addClass('grid-cols-4');
    $("#rowData").removeClass('grid-cols-12');
    let cartoona = "";

    for (let i = 0; i < categories.length; i++) {
        cartoona += `<div onclick="getCategoryMeals('${categories[i].strCategory}')" class="col-span-3 md:col-span-1 group">
                <div class="meal relative overflow-hidden rounded-lg cursor-pointer">
                    <img class="w-full" src="${categories[i].strCategoryThumb}" alt="">
                    <div class="meal-layer text-center absolute inset-0 top-full ps-3 overflow-hidden bg-[#f9f6f6ca] group-hover:top-0 duration-500">
                        <h3 class="text-3xl text-black py-2">${categories[i].strCategory}</h3>
                        <p>${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>`
    }

    $("#rowData").html(cartoona);
}



async function getCategoryMeals(category) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    console.log(data.meals);
    displayData(data.meals.slice(0, 20));
}


$('#area').on('click', function () {
    closeNav();
    $('#searchData').html("");
    getAreas();
})

async function getAreas() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await response.json();
    displayAreas(data.meals);
}

function displayAreas(areas) {
    $("#rowData").addClass('grid-cols-4');
    $("#rowData").removeClass('grid-cols-12');

    let cartoona = "";

    for (let i = 0; i < areas.length; i++) {
        cartoona += `<div class="col-span-3 md:col-span-1">
  <div onclick="getAreaMeals('${areas[i].strArea}')" class="rounded-2 text-center cursor-pointer text-white">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3 class="font-bold text-lg">${areas[i].strArea}</h3>
  </div>
</div>`
    }
    $('#rowData').html(cartoona);
}


async function getAreaMeals(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
    console.log(data.meals);
    displayData(data.meals.slice(0, 20));
}


$('#Ingredients').on('click', function () {
    closeNav();
    $('#searchData').html("");
    getIngredients();
})

async function getIngredients() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await response.json();
    let ingredients = data.meals.slice(0, 20);
    console.log(ingredients);
    displayIngredients(ingredients);
}

function displayIngredients(ingredients) {
    $("#rowData").addClass('grid-cols-4');
    $("#rowData").removeClass('grid-cols-12');

    let cartoona = "";

    for (let i = 0; i < ingredients.length; i++) {
        cartoona += `<div onclick="displayIngredientsMeals('${ingredients[i].strIngredient}')" class="col-span-3 md:col-span-1">
  <div class="rounded-2 text-center cursor-pointer text-white">
    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
    <h3 class="font-bold text-2xl">${ingredients[i].strIngredient}</h3>
    <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
  </div>
</div>`
    }
    $('#rowData').html(cartoona);
}

async function displayIngredientsMeals(ingredient) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    let data = await response.json();
    console.log(data.meals);
    displayData(data.meals.slice(0, 20));
}

function displaySearch() {
    $("#rowData").addClass('grid-cols-4');
    $("#rowData").removeClass('grid-cols-12');
    $('rowData').html("");

    let cartoona = "";
    cartoona = `
    <div class="col-span-6">
  <input oninput="searchName(this.value)" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" type="text" placeholder="Search By Name">
</div>
<div class="col-span-6">
  <input oninput="searchFirstLetter(this.value)" maxlength="1" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" type="text" placeholder="Search By First Letter">
</div>
    `;
    $('#searchData').html(cartoona);
}

$('#search').on('click', function () {
    closeNav();
    $('#rowData').html("")
    displaySearch();
})

async function searchFirstLetter(letter) {
    console.log(letter);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await response.json();
    displayData(data.meals.slice(0, 20));
}


async function searchName(name) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await response.json();
    displayData(data.meals.slice(0, 20));
}

$('#contact').on('click', function () {
    closeNav();
    $('#searchData').html("");
    displayContact();
})

function displayContact() {
    $("#rowData").removeClass('grid-cols-4');
    $("#rowData").addClass('grid-cols-12');
    let cartoona = `
  <div class="col-span-12 md:col-span-6">
    <input oninput="validation()" oninput="validation()" id="nameInput" type="text" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter Your Name">
    <div id="nameAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Special characters and numbers not allowed
    </div>
  </div>
  <div class="col-span-12 md:col-span-6">
    <input oninput="validation()" id="emailInput" type="email" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter Your Email">
    <div id="emailAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Email not valid *exemple@yyy.zzz
    </div>
  </div>
  <div class="col-span-12 md:col-span-6">
    <input oninput="validation()" id="phoneInput" type="text" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter Your Phone">
    <div id="phoneAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Enter valid Phone Number
    </div>
  </div>
  <div class="col-span-12 md:col-span-6">
    <input oninput="validation()" id="ageInput" type="number" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter Your Age">
    <div id="ageAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Enter valid age
    </div>
  </div>
  <div class="col-span-12 md:col-span-6">
    <input oninput="validation()" id="passwordInput" type="password" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter Your Password">
    <div id="passwordAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Enter valid password *Minimum eight characters, at least one letter and one number:*
    </div>
  </div>
  <div class="col-span-12 md:col-span-6">
    <input oninput="checkRePass()" id="repasswordInput" type="password" class="bg-transparent text-white w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500" placeholder="Repassword">
    <div id="repasswordAlert" class="rounded-md bg-red-500 text-white p-3 w-full mt-2 hidden">
      Enter valid repassword
    </div>
  </div>
  <div class="col-span-12 mx-auto"><button id="submitBtn" class="border-2 text-red-500 px-8 py-2 border-red-500 disabled:cursor-not-allowed" disabled>Submit</button></div>
    `
    $('#rowData').html(cartoona)
}




function validation(params) {
    if (nameValidation()) {
        $('#nameAlert').removeClass('block');
        $('#nameAlert').addClass('hidden');
    }
    else {
        $('#nameAlert').addClass('block');
        $('#nameAlert').removeClass('hidden');
    }

    if (emailValidation()) {
        $('#emailAlert').removeClass('block');
        $('#emailAlert').addClass('hidden');
    }
    else {
        $('#emailAlert').addClass('block');
        $('#emailAlert').removeClass('hidden');
    }

    if (ageValidation()) {
        $('#ageAlert').removeClass('block');
        $('#ageAlert').addClass('hidden');
    }
    else {
        $('#ageAlert').addClass('block');
        $('#ageAlert').removeClass('hidden');
    }

    if (phoneValidation()) {
        $('#phoneAlert').removeClass('block');
        $('#phoneAlert').addClass('hidden');
    }
    else {
        $('#phoneAlert').addClass('block');
        $('#phoneAlert').removeClass('hidden');
    }

    if (passValidation()) {
        $('#passwordAlert').removeClass('block');
        $('#passwordAlert').addClass('hidden');
    }
    else {
        $('#passwordAlert').addClass('block');
        $('#passwordAlert').removeClass('hidden');
    }
    if (nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passValidation() &&
    checkRePass) {
    $('#submitBtn').prop('disabled', false);
}
else {
    $('#submitBtn').prop('disabled', true);
}
}

function checkRePass() {
    if ($('#repasswordInput').val() == $('#passwordInput').val()) {
        $('#repasswordAlert').addClass('hidden');
        $('#repasswordAlert').removeClass('block');
    }
    else {
        $('#repasswordAlert').removeClass('hidden');
        $('#repasswordAlert').addClass('block');
    }
}

function nameValidation() {
    return (/^[a-zA-Z\s]+$/.test($('#nameInput').val()))
}
function emailValidation() {
    return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test($('#emailInput').val()))
}
function phoneValidation() {
    return (/^\d{11}$/.test($('#phoneInput').val()))
}
function ageValidation() {
    return (/^(?:1[0-4][0-9]|[1-9]?[0-9])$/.test($('#ageInput').val()))
}
function passValidation() {
    return (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test($('#passwordInput').val()))
}