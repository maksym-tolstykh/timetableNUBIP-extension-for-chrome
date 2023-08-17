//Контейнер з "Чисельник" або "Знаменник"
const weekTypeContainer = document.querySelector('#weekType');
//Змінна для типу "Чисельник" або "Знаменник"
const startWeekType = localStorage.getItem("weekType") ? localStorage.getItem("weekType") : localStorage.setItem("weekType", "Чисельник");
const canUpdate = localStorage.getItem("canUpdate") ? localStorage.getItem("canUpdate") : localStorage.setItem("canUpdate", false);
//Список днів
const days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
const currentDay = new Date();


if (currentDay.getDay() === 0)
    localStorage.setItem("canUpdate", true);

if (currentDay.getDay() === 1 && canUpdate === "true") {

    if (startWeekType === "Чисельник") {
        localStorage.setItem("weekType", "Знаменик");
        localStorage.setItem("canUpdate", false);
    }
    else if (startWeekType === "Знаменик") {
        localStorage.setItem("weekType", "Чисельник");
        localStorage.setItem("canUpdate", false);
    }
}


weekTypeContainer.innerText = startWeekType;

//ID 
const allTagA = document.querySelectorAll('a');
const userIdInput = document.querySelector('#userId');

const userId = localStorage.getItem("userId") || 0;
userIdInput.value = userId

userIdInput.addEventListener('change', (e) => {
    localStorage.setItem("userId", e.target.value)
});

allTagA.forEach(item => {
    item.setAttribute("href", `${item.getAttribute('href')}?authuser=${userId}`);
});



// Підсвічування поточного дня
const daysInTable = document.querySelectorAll("th");
daysInTable.forEach(item => {
    if (days[currentDay.getDay()] === item.innerText) {
        item.style.backgroundColor = "#94ff00"
        console.log(item.innerText);
    }


})


//Підсвічування часу
const currentTime = new Date().getHours().toString();
let currentLesson = 0;

let allTime = [];
let allMonday = [];
let allTuesday = [];
let allWednesday = [];
let allThursday = [];
let allFriday = [];

const allTD = document.querySelectorAll("td").forEach(item => {
    if (item.getAttribute("id")) {
        if (item.getAttribute("id").includes("mo")) {
            allMonday.push(item);
        }
        if (item.getAttribute("id").includes("tu")) {
            allTuesday.push(item);
        }
        if (item.getAttribute("id").includes("we")) {
            allWednesday.push(item);
        }
        if (item.getAttribute("id").includes("th")) {
            allThursday.push(item);
        }
        if (item.getAttribute("id").includes("fr")) {
            allFriday.push(item);
        }
    }
    else {
        allTime.push(item);
    }

});

// parse time
const parseTime = () => {
    if (currentDay >= new Date(currentDay).setHours(8, 30, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(9, 50, 0, 0)) {
        currentLesson = 1;
        allTime[0].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(10, 10, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(11, 30, 0, 0)) {
        currentLesson = 2;
        allTime[1].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(11, 50, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(13, 10, 0, 0)) {
        currentLesson = 3;
        allTime[2].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(13, 30, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(14, 50, 0, 0)) {
        currentLesson = 4;
        allTime[3].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(15, 10, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(16, 30, 0, 0)) {
        currentLesson = 5;
        allTime[4].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(16, 50, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(18, 10, 0, 0)) {
        currentLesson = 6;
        allTime[5].style.backgroundColor = "#94ff00";
    }
    else if (currentDay >= new Date(currentDay).setHours(18, 30, 0, 0) &&
        currentDay <= new Date(currentDay).setHours(19, 50, 0, 0)) {
        currentLesson = 7;
        allTime[6].style.backgroundColor = "#94ff00";
    }
}
parseTime();

const parseLesson = () => {
    if (currentDay.getDay() === 1)
        allMonday[currentLesson - 1].style.backgroundColor = "#94ff00"
    if (currentDay.getDay() === 2)
        allTuesday[currentLesson - 1].style.backgroundColor = "#94ff00"
    if (currentDay.getDay() === 3)
        allWednesday[currentLesson - 1].style.backgroundColor = "#94ff00"
    if (currentDay.getDay() === 4)
        allThursday[currentLesson - 1].style.backgroundColor = "#94ff00"
    if (currentDay.getDay() === 5)
        allFriday[currentLesson - 1].style.backgroundColor = "#94ff00"
}

parseLesson();











