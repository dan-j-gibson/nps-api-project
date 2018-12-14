'use strict';
const apiKey ='W8DxXIf8BprQ5kV2NocauuIkaoKM7V8BgNvmnK4z'

//This funtion renders the results and diplays them in the DOM
function displayResults(responseJson) {
    console.log('displayResults ran');
    //When data is ready - hides progress indicator
    $(responseJson).ready(function () {
        $('.loading').addClass('hidden')
    })
    console.log(responseJson)
    console.log(responseJson.length)

    //removes hidden class to display results
    $('.js-results').removeClass('hidden')

}

function formatQueryParams(states, maxResults){
    console.log('formatQueryParams ran');
    let queryString = ''
    for (let i = 0 ; i < states.length ; i++){
        queryString += `stateCode=${states[i]}&`
    }
    queryString += `limit=${maxResults}`
    console.log(queryString)
    return queryString
}

//Fetches data from API, converts and passes data to be displayed in DOM
function getParks(states,maxResults) {
    console.log('getParks ran');
    
    const endPoint = `https://api.nps.gov/api/v1/parks`
    const queryString = formatQueryParams(states, maxResults)
    const url = endPoint + '?' + queryString + '&fields=addresses'
    console.log(url);
    
    const options = {
        headers: new Headers({
          "X-Api-Key": apiKey})
      };
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
        .then(responseJson => console.log(responseJson))
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
    return (['Search', 'Find', 'Let\'s Travel','Look up','Go'])[Math.floor(Math.random() * 5)];
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
            //pass username to API call 
            getParks(states, maxResults);
        // }, 1000)
    });
}

$(watchForm);