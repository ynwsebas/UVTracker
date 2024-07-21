import { apiKey } from "./export.js";
const form = document.getElementById('form');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');

//regex to ensure proper inputs

let validLat = false;
let validLong = false;

latitude.addEventListener("input", (event) => {

    const regex = /^-?([1-8]?\d(\.\d{1,2})?|90(\.0{1,2})?)$/;
    const latInput = latitude.value;
    const valid = regex.test(latInput);
    const warning = document.getElementById('lat-warn');

    if((!valid && latInput.length)){
        latitude.classList.add("badInput");
        warning.style.display = "flex";
        validLat = false;
    } else{
        latitude.classList.remove("badInput");
        warning.style.display = "none";
        validLat = true;
    }

    if(!latInput){
        validLat = false;
    }

    updateSubmit();

})

longitude.addEventListener("input", (event) => {

    const regex = /^-?((1[0-7]\d|0?\d{1,2})(\.\d{1,2})?|180(\.0{1,2})?)$/;
    const longInput = longitude.value;
    const valid = regex.test(longInput);
    const warning = document.getElementById('long-warn');

    if(!valid && longInput.length){
        longitude.classList.add("badInput");
        warning.style.display = "flex";
        validLong = false;
    } else{
        longitude.classList.remove("badInput");
        warning.style.display = "none";
        validLong = true;
    }

    if(!longInput){
        validLong = false;
    }

    updateSubmit();

})

const updateSubmit = () => {

    const submit = document.getElementById('submit');

    if(validLat && validLong){
        submit.style.display = "inline-block";
        submit.disabled = false;
    } else{
        submit.style.display = "none";
        submit.disabled = true;
    }

}

//function to receive inputs

const receiveInput = () =>{

    const latInput = latitude.value;
    const longInput = longitude.value;
    const inputObj = {
        latitude: latInput, 
        longitude: longInput
    }

    form.reset();
    return inputObj;

}

//function to format into proper URL

const formatURL = (input) => {
    return `https://api.openuv.io/api/v1/uv?lat=${input.latitude}&lng=${input.longitude}`;
}

//async function to fetch JSON data from API

const getUVIndex = async (url) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "x-access-token": apiKey,
            redirect: "follow"
        }
    });

    const jsonUVData = await response.json();
    return jsonUVData;

}


//function to display data to user

const displayData = (data, input) => {

    const div = document.getElementById('results');
    div.style.display = "flex";
    div.innerHTML = `
        <p>Reading from: [${input.latitude}, ${input.longitude}]</p>
        <h1>Current UV: ${data.result.uv}</h1>
        <h2>Today's max UV: ${data.result.uv_max}</h2>
    `;

}

//function to execute upon submit

const processRequest = async() => {
    
    const input = receiveInput();
    const url = formatURL(input);
    const data = await getUVIndex(url);
    displayData(data, input);

}

//event listener to trigger process

form.addEventListener("submit", (event) => {

    event.preventDefault();
    validLat = validLong = false;
    updateSubmit();
    processRequest();

})