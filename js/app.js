/*
* Project name:         Use a Public API to Create an Employee Directory
* Student name:         Alex Khant (http://github.com/grashupfer99)
* Updated:              2018-06-17
*/

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const employees = document.querySelector('.employees');
let curProfile; 

const formatBday = (bday) => {
    let newBday = bday.slice(0,10).split("-");
    return `${newBday[2]}/${newBday[1]}/${newBday[0].slice(2,4)}`;
}

const nationalities = ['au','ca','gb','ir','nl','nz','us'];


const renderDetails = (profile) => {
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
                        <span class="name">${capitalize(profile.name.first)} ${capitalize(profile.name.last)}</span>
                        <span>${profile.email}</span>
                        <span>${profile.location.city}</span>
                        <hr>
                        <span>${profile.cell}</span>
                        <span>${profile.location.street} 
                                              ${profile.location.city} 
                                              ${profile.location.state}
                                              ${profile.location.postcode}</span>
                        <span>birthday: ${formatBday(profile.dob.date)}</span>
                    </div>
                    <div class="pagination">
                        <span id="prev"><i class="fas fa-arrow-left"></i></span>
                        <span id="next"><i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `;
    overlay.insertAdjacentHTML("beforeend", detailedProfile);
}






employees.addEventListener('click', e => {

    if (e.target.className === "employee" || 
        e.target.parentNode.className === "employee" ||
        e.target.parentNode.parentNode.className === 'employee') {

        overlay.style.display = "block";
        modal.style.display = "block";
        
        //console.log(overlay.children.length);
        // Remove previous created element 
        // if (overlay.children.length > 0){
        //     overlay.removeChild(document.querySelector('.profile'));
        // }

        let getIndex = e.target.getAttribute("data-index") ||
            e.target.parentNode.getAttribute("data-index") ||
            e.target.parentNode.parentNode.getAttribute("data-index");
        
        let profile = db.results[getIndex];
        curProfile = parseInt(getIndex);
        // console.log(getIndex);
        // console.log('----')
        // console.log(db.results[getIndex]);
        //console.log(e.target);
        renderDetails(profile);

        // if (e.target.id === 'prev' || e.target.className === 'fas fa-arrow-left'){
        //     console.log('prev');
        // }
        // if (e.target.id === 'next' || e.target.className === 'fas fa-arrow-right'){
        //     console.log('next');
        // }

        // const detailedProfile = `
        //         <div class="profile">
        //             <span class="close"><i class="fas fa-times"></i></span>
        //             <div class="img">
        //                 <img src="${profile.picture.large}" alt="${capitalize(profile.name.first)} ${capitalize(profile.name.last)}">
        //             </div>
        //             <div class="details">
        //                 <span class="name">${capitalize(profile.name.first)} ${capitalize(profile.name.last)}</span>
        //                 <span>${profile.email}</span>
        //                 <span>${profile.location.city}</span>
        //                 <hr>
        //                 <span>${profile.cell}</span>
        //                 <span>${profile.location.street} 
        //                                       ${profile.location.city} 
        //                                       ${profile.location.state}
        //                                       ${profile.location.postcode}</span>
        //                 <span>birthday: ${formatBday(profile.dob.date)}</span>
        //             </div>
        //             <div class="pagination">
        //                 <span id="prev"><i class="fas fa-arrow-left"></i></span>
        //                 <span id="next"><i class="fas fa-arrow-right"></i></span>
        //             </div>
        //         </div>
        //     `;
        // overlay.insertAdjacentHTML("beforeend", detailedProfile);
        
    }
    
});

overlay.addEventListener('click', e => {
    //console.log(e.target.className);
    if (e.target.className === "close" || e.target.className === "fas fa-times") {
      overlay.style.display = "none";
      modal.style.display = "none";
    }
    console.log("index: " + curProfile);
    // console.log(getIndex);
    // console.log('----')
    // console.log(db.results[getIndex]);
    

        if (e.target.id === 'prev' || e.target.className === 'fas fa-arrow-left'){
            console.log('prev');
            if (curProfile === 0) {
                curProfile = 12;
            }
            let dat = db.results[curProfile -= 1];
            renderDetails(dat);

        }
        if (e.target.id === 'next' || e.target.className === 'fas fa-arrow-right'){
            console.log('next');
            if(curProfile === 11){
                curProfile = -1;
            }
            let dat = db.results[curProfile += 1];
            renderDetails(dat);
        }
});


window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

const capitalize = (str) => {
    const temp = str.toLowerCase().split(' ');
    const res = temp.map((val) => val.replace(val.charAt(0), val.charAt(0).toUpperCase()));
    return res.join(' ');
}

//let markup;
let db =[];

const fetchDataAW = async (url) => {
    try{
        const result = await fetch(url);
        const data = await result.json();
        //console.log(data.results[0]);
        db = data;

        const display = data.results.map((profile,index) => {

            const markup = `
                <div class="employee" data-index="${index}">
                    <div class="picture">
                        <img src="${profile.picture.large}" alt="${capitalize(profile.name.first)} ${capitalize(profile.name.last)}">
                    </div>
                    <div class="info">
                        <span class="name">${profile.name.first} ${profile.name.last}</span>
                        <span class="email">${profile.email}</span>
                        <span class="location">${profile.location.city}</span>
                    </div>
                </div>
            `;
            employees.insertAdjacentHTML("beforeend", markup);
        });

      
        
        
    } catch(error){
        // what happends when there is an error
        console.log(`Error alert! ${error}`);
    }

    // return fetch(url)
    //     .then(checkStatus)
    //     .then(res => res.json())
    //     .catch(error => console.log(`Error... ${error}`));
}

// const checkStatus = (response) => {
//     if (response.ok) {
//         return Promise.resolve(response);
//     } else {
//         return Promise.reject(new Error(response.statusText));
//     }
// }
let nat = ['au', 'ca', 'gb', 'nl', 'nz', 'us'];

console.log("before");
console.log(nat);
let i = nat.length, j, temp;
while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1)); // Get random number ranging between 0 and i
        temp = nat[j];
        nat[j] = nat[i];
        nat[i] = temp;
}

console.log('after');
console.log(nat);
console.log('------------');
console.log(`https://randomuser.me/api/?nat=${nat[0]},${nat[1]}&results=12`);

fetchDataAW(`https://randomuser.me/api/?nat=${nat[0]},${nat[1]}&results=12`);
    // .then(data => {
    //     console.log(data.results);
    //     });

