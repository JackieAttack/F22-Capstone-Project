const search = document.querySelector("#search")
const searchBtn = document.querySelector("#search-btn")
const searchResult = document.querySelector("#search-results")
const resultsFor = document.querySelector("#results-for")
const col1 = document.querySelector('#col-1')
const col2 = document.querySelector('#col-2')
const col3 = document.querySelector('#col-3')
const col4 = document.querySelector('#col-4')
const moreInfoSec = document.querySelector('#more-info')

//let geneArr

function searchGene(event) {
    event.preventDefault();

    let term = search.value
    
    if(term) {
        sessionStorage.setItem("searchTerm", term)
        term.replaceAll(" ", "+")
        axios.get(`/search/${term}`)
        .then((res) => {
            //geneArr = res.data
            //sessionStorage.setItem("geneArr", res.data)
            sessionStorage.setItem("searchData", JSON.stringify(res.data))
            console.log(res.data)
            generateSearchTable()
        })
        .catch((err) => {console.log(err)})

    } else {
        alert('Input a value before searching')
    }
}

function generateSearchTable() {
    let term = sessionStorage.getItem("searchTerm")
    resultsFor.textContent = `Results for: ${term}`
    col1.textContent = "Gene Name"
    col2.textContent = "Species"
    col3.textContent = "Description"
    col4.textContent = "Detailed Report"
    let geneArr = JSON.parse(sessionStorage.getItem("searchData"));

    //creates a table from the recieved array
    for(i = 0; i < geneArr.length - 1; i++) {

        let newPost = document.createElement('tr')
        newPost.innerHTML = 
        `<td>${geneArr[i].name}</td>
        <td>${geneArr[i].organism.scientificname}</td>
        <td>${geneArr[i].description}</td>
        <td><button id="info-${i}">More Info</button></td>`;
        searchResult.appendChild(newPost)
        let newBtn = document.querySelector(`#info-${i}`)
        newBtn.addEventListener("click", moreInfo)
        search.value = ``
    }
}

function moreInfo(event) {
    event.preventDefault();
    //bring user to new page with detailed view

    let geneArr = JSON.parse(sessionStorage.getItem("searchData"));
    let id = event.target.id.split("-")
    let gene = geneArr[+id[1]]
    console.log(id)
    resultsFor.textContent = ``
    searchResult.innerHTML = `
    <tr>
    <th id="col-1"></th>
    <th id="col-2"></th>
    <th id="col-3"></th>
    <th id="col-4"></th>
    </tr>`

    moreInfoSec.innerHTML = `
    <h3>${gene.name}</h3>
    <p>Uid: ${gene.uid}</p>
    <div class="italic">Species: ${gene.organism.scientificname} - TaxId: ${gene.organism.taxid}</div>
    <h4>Summary</h4>
    <p>${gene.summary}</p>`
    // axios.get(`/moreInfo/${id}`)
    // .then((res) => {

    // })
    // .catch((err) => {console.log(err)})
}

let geneKeys = ['uid', 'chromosome', 'description','geneticsource', 'geneweight', 'name', 'nomenclaturename', 'nomenclaturesymbol', 'organism', 'otheraliases', 'otherdesignations', 'summary']


searchBtn.addEventListener("click", searchGene)