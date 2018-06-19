/*
* Project name:         Use a Public API to Create an Employee Directory
* Student name:         Alex Khant (http://github.com/grashupfer99)
* Updated:              2018-06-19
*/

// DOM strings
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const employees = document.querySelector('.employees');
const container = document.getElementById('container');
// Dynamically creating a search form
const form = document.createElement('form');
container.insertBefore(form, employees);
const searchInput = document.createElement("input");
searchInput.type = 'search';
searchInput.id = 'search';
searchInput.placeholder = 'Enter name or username';
form.appendChild(searchInput);
// Storing current profile's index to switch between profiles
let curProfile; 
// Storing profiles to use this data later in the project   
let db = [];
// Array of nationalities
const natl = ['au', 'ca', 'gb', 'nl', 'nz', 'us'];

// Format birthday date
const formatBday = (bday) => {
    let newBday = bday.slice(0,10).split("-");
    return `${newBday[2]}/${newBday[1]}/${newBday[0].slice(2,4)}`;
}

// Render loader before getting data from ajax
const renderLoader = parentEl => {
    const loader = `
        <div class="fa-3x" id="loader">
            <i class="fas fa-sync fa-spin"></i>
        </div>
    `;
    parentEl.insertAdjacentHTML("beforeend", loader);
}

// Remove loader after getting data from ajax
const clearLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}

// Fetch data 
const fetchDataAW = async (url) => {
    // Render loader before getting data from ajax
    renderLoader(container);
    // Execute this code, if error, then run catch
    try {
        const result = await fetch(url);
        const data = await result.json();
        // store 12 profiles in db variable  
        db = data;
        // Remove loader after getting data from ajax
        clearLoader();
        // Render employees
        data.results.map((profile, index) => {
            const markup = `
                <div class="employee" data-index="${index}">
                    <div class="picture">
                        <img src="${profile.picture.large}" alt="${capitalize(profile.name.first)} ${capitalize(profile.name.last)}">
                    </div>
                    <div class="info">
                        <span class="name">${profile.name.first} ${profile.name.last} <span class="is-hidden">${profile.login.username}</span></span>
                        <span class="email">${profile.email}</span>
                        <span class="location">${profile.location.city}</span>
                    </div>
                </div>
            `;
            employees.insertAdjacentHTML("beforeend", markup);
        });
        // If error - run catch
    } catch (error) {
        console.log(`Error alert! ${alert(error)}`);
    }
}

// Render modal window
const renderDetails = (profile) => {
    // Remove profile if already exists, otherwise create a new one 
    if (overlay.children.length > 0) {
        overlay.removeChild(document.querySelector('.profile'));
    }

    const detailedProfile = `
                <div class="profile">
                    <span class="close"><i class="fas fa-times"></i></span>
                    <div class="img">
                        <img src="${profile.picture.large}" alt="${capitalize(profile.name.first)} ${capitalize(profile.name.last)}">
                    </div>
                    <div class="details">
                        <span class="name">${profile.name.first} ${profile.name.last}</span>
                        <span>${profile.login.username}</span>
                        <span>${profile.email}</span>
                        <span>${profile.location.city}</span>
                        <hr>
                        <span>${profile.cell}</span>
                        <span>
                            ${profile.location.street}, 
                            ${profile.location.city}, 
                            ${profile.location.state}, 
                            ${profile.location.postcode}</span>
                        <span>birthday: ${formatBday(profile.dob.date)}</span>
                    </div>
                    <div class="pagination">
                        <span id="prev"><i class="fas fa-arrow-left"></i></span>
                        <span id="next"><i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `;
    // Append to the DOM
    overlay.insertAdjacentHTML("beforeend", detailedProfile);
}

// Capitalize word
const capitalize = (str) => {
    const temp = str.toLowerCase().split(' ');
    const res = temp.map((val) => val.replace(val.charAt(0), val.charAt(0).toUpperCase()));
    return res.join(' ');
}

/// EVENT LISTENERS ///
// Form event handler
form.addEventListener('submit', function (e) {
    // Prevent default action
    e.preventDefault();
});
// Handle search queries in real time as the user types
searchInput.addEventListener('keyup', function () {
    const searchQuery = searchInput.value.toUpperCase();
    Array.from(employees.children).map(profile => {
        // Filter by name
        if (profile.querySelector('.name').textContent.toUpperCase().includes(searchQuery)) {
            profile.style.display = 'inline-block';
        } else {
            profile.style.display = "none";
        }
    });
});

// Event handler for employees container
employees.addEventListener('click', e => {
    // Do stuff if clicked on elements which parent is '.employee'
    if (e.target.className === "employee" || 
        e.target.parentNode.className === "employee" ||
        e.target.parentNode.parentNode.className === 'employee') {
        // display detailed profile and modal
        overlay.style.display = "block";
        modal.style.display = "block";
        // get each employee profile's index 
        let getIndex = e.target.getAttribute("data-index") ||
            e.target.parentNode.getAttribute("data-index") ||
            e.target.parentNode.parentNode.getAttribute("data-index");
        // Render clicked profile
        let profile = db.results[getIndex];
        renderDetails(profile);
        // Get current profile's index to switch between profiles
        curProfile = parseInt(getIndex);
    }
});

// Switching between profles
overlay.addEventListener('click', e => {
    // Close the popup window 
    if (e.target.className === "close" || e.target.className === "fas fa-times") {
      overlay.style.display = "none";
      modal.style.display = "none";
    }
    // Go to previous employee 
    if (e.target.id === 'prev' || e.target.className === 'fas fa-arrow-left'){
        // If reached 1st employee, start from the last
        if (curProfile === 0) curProfile = 12;
        let profile = db.results[curProfile -= 1];
        renderDetails(profile);
    }
    // Next employee
    if (e.target.id === 'next' || e.target.className === 'fas fa-arrow-right'){
        // If reached the last employee on the list, start from 1st
        if(curProfile === 11) curProfile = -1;
        let profile = db.results[curProfile += 1];
        renderDetails(profile);
    }
});

// Close modal if clicked outside of it
window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// Fisher-Yates Modern shuffle algorithm to get 2 random nationalities from the array 
let i = natl.length, j, temp;
while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
        temp = natl[j];
        natl[j] = natl[i];
        natl[i] = temp;
}

// Fetch data - get 12 random employees and 2 random nationalities 
fetchDataAW(`https://randomuser.me/api/?nat=${natl[0]},${natl[1]}&results=12`);