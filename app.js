const API_KEY = "api_key=a176e62edb4849844c9b8f86122e4e81"
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY
const IMG_URL = "https://image.tmdb.org/t/p/w300"
const searchURL = BASE_URL + "/search/movie?"+API_KEY

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]




const mainEl = document.getElementById("main")
const form = document.getElementById("form")
const search = document.getElementById("search")
const tagsEl = document.getElementById("tags")
const header = document.getElementById("header")
let showTagsEl = document.getElementById("show-tags")

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const currentEl = document.getElementById("current")

let currentPage = 1;
let nextPage = 2
let prevPage = 3
let lastUrl = ""
let totalPages = 100


showTagsEl.addEventListener("click", function() {
    tagsEl.classList.remove("hide")
    showTagsEl.classList.add("hide")
    const hideTags = document.createElement('div')
    hideTags.classList.add("hide-tags")
    hideTags.innerText = "Hide Tags"
    hideTags.addEventListener("click", function(){
        tagsEl.classList.add("hide")
        hideTags.classList.add("hide")
        showTagsEl.classList.remove("hide")

    })
    header.append(hideTags)
})

let selectedGenre = []

sertGenre() 
function sertGenre() {
  tagsEl.innerHTML = ''
  genres.forEach(genre => {
    const t = document.createElement('div')
    t.classList.add("tag")
    t.id=genre.id
    t.innerText = genre.name
    t.addEventListener("click", function(){
           if(selectedGenre.length == 0){
            selectedGenre.push(genre.id)
           } else {
               if(selectedGenre.includes(genre.id)){
                 selectedGenre.forEach((id, idx) => {
                    if (id == genre.id){
                        selectedGenre.splice(idx, 1)
                    }
                 })
               } else {
                  selectedGenre.push(genre.id)
               }
           }
           getMovies(API_URL + "&with_genres="+encodeURI(selectedGenre.join(',')))
           highlightSelection()
    })
    tagsEl.append(t)
  })
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag")
  tags.forEach(tag => {
    tag.classList.remove('highlight')
  })
  clearBtn()
   if(selectedGenre.length !=0) {
   selectedGenre.forEach(id => {
         const highlightedTag = document.getElementById(id)
         highlightedTag.classList.add("highlight")
            })
}

}


function clearBtn(){
     let clearBtn = document.getElementById("clear")
     if(clearBtn) {
         clearBtn.classList.add("highlight")
     } else {
        let clear = document.createElement("div")
        clear.classList.add("tag", "highlight")
        clear.id = "clear"
        clear.innerText = "Clear Selected Tags"
        clear.addEventListener("click", () => {
            selectedGenre = []
            sertGenre()
            getMovies(API_URL)
        })
        tagsEl.append(clear)
     }

 
}




getMovies(API_URL)

function getMovies(url) {
  lastUrl = url
  fetch(url).then(res => res.json()).then(data =>  {
   
    if(data.results.length != 0){
    showMovies(data.results)
     currentPage = data.page;
     nextPage = currentPage + 1
     prevPage = currentPage - 1
     totalPages = data.total_pages

     currentEl.innerText = currentPage

     if(currentPage <= 1){
      prev.classList.add("disabled")
      next.classList.remove("disabled")
     } else if (currentPage>=totalPages) {
     prev.classList.remove("disabled")
     next.classList.add("disabled")
    } else {
      prev.classList.remove("disabled")
      next.classList.remove("disabled")
    }

    tagsEl.scrollIntoView({behavior : "smooth"})

    } else {
        mainEl.innerHTML = "<h1 class='no-results'>NO RESULTS FOUND :(</h1>"
    }
  })

}







function showMovies(data){
    mainEl.innerHTML = ""


    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie
        const movieEl = document.createElement("div")
        movieEl.classList.add("movie")
        movieEl.innerHTML = `  
        <img src="${IMG_URL+poster_path}" alt="${title}>
        <div class="movie-info">
        <span class="${getColor(vote_average)}"> ${vote_average} </span>
               <h3>${title}</h3>
               
        </div>
      
        <div class="overview">
           <h4>Description</h4>
        ${overview}
        </div>`

   if(!poster_path){
    movieEl.innerHTML = `
    

    <img class="no-img" src="No-image-found.jpg" alt="${title}>
    <div class="movie-info">
    <span class="${getColor(vote_average)}"> ${vote_average} </span>
           <h3>${title}</h3>
           
    </div>
  
    <div class="overview">
       <h4>Overview</h4>
    ${overview}
    </div>
    
    `
   
   }
         
        mainEl.appendChild(movieEl)
    })
}



function getColor(vote) {
    if(vote >= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault()

    const searchTerm = search.value 
    selectedGenre = []
    highlightSelection()
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }
})


next.addEventListener("click", () => {
  if(nextPage <= totalPages){
    pageCall(nextPage)
  }
})
prev.addEventListener("click", () => {
  if(prevPage > 0){
    pageCall(prevPage)
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?')
  let queryParams = urlSplit[1].split('&')
  let key = queryParams[queryParams.length -1].split('=')
  if(key[0] != "page"){
    let url = lastUrl + "&page="+page
    getMovies(url)
  } else {
   key[1] = page.toString()
   let a = key.join('=')
   queryParams[queryParams.length -1] = a
   let b = queryParams.join("&")
   let url = urlSplit[0] +'?'+ b
   getMovies(url)
  }
   
}