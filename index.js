'use strict';
const apiKey = 'W8DxXIf8BprQ5kV2NocauuIkaoKM7V8BgNvmnK4z'

//This funtion renders the results and diplays them in the DOM
function displayResults(responseJson) {
    console.log('displayResults ran');
    //When data is ready - hides progress indicator
    $(responseJson).ready(function () {
        $('.loading').addClass('hidden')
    })
    console.log(responseJson)
    //data is an object within the nps JSON that contains the info we want and whose value is an array
    let parkData = responseJson.data
    console.log(parkData.length)
    //initialize string to hold html for DOM manipulation
    let parkHTML = ''
    //Loop through data and extract name, description, website link, and addresses and prep data to be displayed as HTML
    for (let i = 0; i < parkData.length; i++) {
        parkHTML += `
    <div class="result-item"><li><h3>${parkData[i].name}</h3>
    <p class="park-description">${parkData[i].description}</p>
    <a href="${parkData[i].url}">${parkData[i].url}</a>
    <div id="addresses">
    <h4>Addresses</h4>
    `
    for (let x = 0; x < parkData[i].addresses.length; x++) {
        parkHTML +=  `
    
    <h5>${parkData[i].addresses[x].type}:</h5>
    <p class="addresses">${parkData[i].addresses[x].line1}</p>
    <p class="addresses">${parkData[i].addresses[x].line2}</p>
    <p class="addresses">${parkData[i].addresses[x].line3}</p>
    <p class="addresses">${parkData[i].addresses[x].city}, ${parkData[i].addresses[x].stateCode}, ${parkData[i].addresses[x].postalCode}</p>
    `
        }
        parkHTML +=   `</div></li></div>`
    }
    // append extracted data 
    $('.js-results').append(parkHTML)
    //removes hidden class to display results
    $('.js-results').removeClass('hidden')

}

//This function takes user's state and max results selection and converts it into query string to be used to access API
function formatQueryParams(states, maxResults) {
    console.log('formatQueryParams ran');
    let queryString = ''
    for (let i = 0; i < states.length; i++) {
        queryString += `stateCode=${states[i]}&`
    }
    queryString += `limit=${maxResults}`
    console.log(queryString)
    return queryString
}

//Fetches data from API, converts and passes data to be displayed in DOM
function getParks(states, maxResults) {
    console.log('getParks ran');
    //Initiate endPoint variable
    const endPoint = `https://api.nps.gov/api/v1/parks`
    //pass user's parameters to form query string
    const queryString = formatQueryParams(states, maxResults)
    //Combine endPoint and queryString to form url to pull data from
    const url = endPoint + '?' + queryString + '&fields=addresses'
    console.log(url);

    // const options = {
    //     headers: new Headers({
    //       "X-Api-Key": apiKey})
    //   };
    //Asynchronous request to GitHub API
    fetch(url)
        //if repsonse is good, returns results in JSON format
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            //if reponse is not ok,then throw an error
            throw new Error(response.statusText);
        })
        //if reponse is ok, then we pass the JSON results into displayResults to be rendered in DOM
        .then(responseJson => displayResults(responseJson))
        //if reponse is not ok, then the error we threw will be passed as a parameter in the displayError function and rendered in DOM
        .catch(err => {
            displayError(err.message);
        });
}

//Takes thrown error as parameter and displays in DOM
function displayError(error) {
    console.log('displayError ran');
    $('.js-results').html(`<h3 class="error">Something went wrong: ${error}</h3>`)
    $('.loading').addClass('hidden');
    $('.js-results').removeClass('hidden')
}
//This function uses random to select the text of the Search Button
function getSearchPhrase() {
    return (['Search', 'Find', 'Let\'s Travel', 'Look up', 'Go'])[Math.floor(Math.random() * 5)];
}

//Event listener for submit event
function watchForm() {
    //Listens for submit event
    $('#js-form').submit(event => {
        //override default behavior
        event.preventDefault();
        console.log('watchForm ran');
        //determine the text of the button
        let searchPhrase = getSearchPhrase()
        console.log(searchPhrase)
        //change the text of the search button
        $('#find-btn').html(searchPhrase)
        //clears any prior data from results section
        $('.js-results').empty().addClass('hidden')
        //store username 
        const states = $('.js-states').val();
        console.log(states);
        const maxResults = $('.js-max-results').val();
        console.log(maxResults);
        //This utilizes setTimeout function to test progress indicator animation
        $('.loading').removeClass('hidden');
        // setTimeout(function () {
        // pass username to API call 
        getParks(states, maxResults);
        // }, 5000)
    });
}

$(watchForm);