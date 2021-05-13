// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // deifne the year and genre parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

  // create the two arrays to be returned by API
  let movies = []
  let numResults =0
  // loop through movie data
  for (let i = 0 ; i < moviesFromCsv.length ; i++) {
    
    // store each item to the array
    let movieObject = moviesFromCsv[i]
    
    // skip items wtihout genre or run time data
    if (movieObject.genres != `\\N` && movieObject.runtimeMinutes != `\\N`) {
      // store results only if genre and start year equal to the specified values    
      if (movieObject.genres.includes(genre) == true && movieObject.startYear.includes(year)==true) {
      let movie = {
        title: movieObject.primaryTitle,
        year: movieObject.startYear,
        genre: movieObject.genres
      }
      // push the result into the movies array
      movies.push(movie)
      // count numResults
      numResults = numResults +1 

    }
   }
  }
  // return error message if the user does not specify year or genre
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please enter year and genre` // a string of data
    }
  }
  // return the result as a string
  else {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify({numResults, movies}) // a string of data
      
    }

  }
}