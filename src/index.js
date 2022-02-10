const dogBar = document.querySelector("#dog-bar");
const dogInfo = document.querySelector("#dog-info");
const filterBttn = document.querySelector("#good-dog-filter");
let filterStatus = false;
const dogsArray = [];

const getDogs = () => {
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(data => {
        data.forEach(dog => {
            renderDog(dog);
            dogsArray.push(dog);
        })
    })
}

const renderDog = dog => {
    const dogSpan = document.createElement("span");
    dogSpan.textContent = dog.name;

    dogSpan.addEventListener("click", () => {
        renderDogInfo(dog);
    });

    dogBar.append(dogSpan);
}

const renderDogInfo = dog =>{
    dogInfo.replaceChildren();

    const dogDiv = document.createElement("div");
    const img = document.createElement("img");
    const h1 = document.createElement("h1");
    const isGoodDogBttn = document.createElement("button");

    h1.textContent = dog.name;
    dogDiv.append(h1);

    img.src = dog.image;
    dogDiv.append(img);

    if(dog.isGoodDog){
        isGoodDogBttn.textContent = "GOOD BOY";
    }
    else{
        isGoodDogBttn.textContent = "BAD BOY";
    }
    isGoodDogBttn.addEventListener("click", e => handleBttnClick(dog, e))
    dogDiv.append(isGoodDogBttn);

    dogInfo.append(dogDiv);
}

const handleBttnClick = (dog, e) => {
    dog.isGoodDog = !dog.isGoodDog;
    if(dog.isGoodDog){
        e.target.textContent = "GOOD BOY";
    }
    else{
        e.target.textContent = "BAD BOY";
    }
    
    fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dog)
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

filterBttn.addEventListener("click", () => {
    if(filterBttn.getAttribute("filter") === "off"){
        filterBttn.setAttribute("filter", "on");
        filterBttn.textContent = "Filter good dogs: ON"
        filterStatus = true;
        dogBar.replaceChildren();

        for(const dog of dogsArray){
            if(dog.isGoodDog){
                renderDog(dog)
            }
        }
    }
    else{
        filterBttn.setAttribute("filter", "off");
        filterBttn.textContent = "Filter good dogs: OFF"
        filterStatus = false;
        dogBar.replaceChildren();
        dogsArray.forEach(dog => renderDog(dog));
    }
})

getDogs();