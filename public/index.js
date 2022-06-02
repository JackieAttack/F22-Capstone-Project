const search = document.querySelector("#search")
const searchBtn = document.querySelector("#search-btn")
const searchResult = document.querySelector("#search-results")
const resultsFor = document.querySelector("#results-for")
const moreInfoSec = document.querySelector('#more-info')
const comments = document.querySelector('#comments')
const commentForum = document.querySelector('#comment-forum')
const navigation = document.querySelector('nav')

function searchGene(event) {
    event.preventDefault();

    let term = search.value
    
    if(term) {
        sessionStorage.setItem("searchTerm", term)
        term.replaceAll(" ", "+")
        axios.get(`/search/${term}`)
        .then((res) => {
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
    moreInfoSec.innerHTML = ``
    comments.classList.add('hidden')
    comments.classList.remove('comments')
    commentForum.innerHTML = ``
    navigation.innerHTML = ``
    searchResult.innerHTML = `
    <tr>
    <th id="col-1">Gene Name</th>
    <th id="col-2">Species</th>
    <th id="col-3">Description</th>
    <th id="col-4">Detailed Report</th>
    </tr>`
    
    let term = sessionStorage.getItem("searchTerm")
    resultsFor.textContent = `Results for: ${term}`
    
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
    
    navigation.innerHTML = `<button id="home">Home</button><button id="back">Back</button>`
    let back = document.querySelector('#back')
    let home = document.querySelector('#home')
    back.addEventListener("click", generateSearchTable)
    home.addEventListener("click", resetToHome)

    let geneArr = JSON.parse(sessionStorage.getItem("searchData"));
    let id = event.target.id.split("-")
    let gene = geneArr[+id[1]]
    resultsFor.textContent = ``
    searchResult.innerHTML = ``

    moreInfoSec.innerHTML = `
    <h3>${gene.name}</h3>
    <p>Uid: ${gene.uid}</p>
    <div class="italic">Species: ${gene.organism.scientificname} - TaxId: ${gene.organism.taxid}</div>
    <h4>Summary</h4>
    <p class="text-box">${gene.summary}</p>
    <table id="info-table">
    <tr><td>Genetic Source</td><td>${gene.geneticsource}</td></tr>
    <tr><td>Chromosome</td><td>${gene.chromosome}</td></tr>
    <tr><td>Gene Weight</td><td>${gene.geneweight}</td></tr>
    <tr><td>Map Location</td><td>${gene.maplocation}</td></tr>
    </table>
    <button id="add-comment-${gene.uid}">Add Comment</button>`

    let commentBtn = document.querySelector(`#add-comment-${gene.uid}`)
    commentBtn.addEventListener("click", toggleCommentSec)

    //comments section
    axios.get(`/returncomments/${gene.uid}`)
    .then((res) => {
        console.log(res.data)
        let commentsArr = res.data
        commentForum.innerHTML = ``
        for(i = 0; i < commentsArr.length; i++) {

            let commentItem = document.createElement('div')
            commentItem.classList.add('comment-card')
            commentItem.innerHTML = `
            <div class="comment-header">
            <h7>${commentsArr[i].username}:</h7>
            <h9>${commentsArr[i].date_posted}</h9>
            </div>
            <p>${commentsArr[i].content}</p>`
            commentForum.appendChild(commentItem)
        }
        
    }).catch((err) => {console.log(err)})
}


function toggleCommentSec(event) {
    comments.classList.toggle('hidden')
    comments.classList.toggle('comments')
    
    let id = event.target.id.split("-")
    let uid = +id[2]
    
    comments.innerHTML = `
    <h5>Add a comment using the form below:</h5>
    <input type="name-${uid}" placeholder="Name" id="name-${uid}"></input>
    <input class="comment-box" type="text-${uid}" placeholder="Comment..." id="text-${uid}"></input>
    <button id="submit-${uid}">Submit</button>
    `
    let submit = document.querySelector(`#submit-${uid}`)
    submit.addEventListener("click", createComment)
}

function createComment(event) {
    let id = event.target.id.split("-")
    let uid = +id[1]

    let name = document.querySelector(`#name-${uid}`)
    let text = document.querySelector(`#text-${uid}`)

    let body = {
        uid: uid,
        name: name.value,
        text: text.value
    }

    axios.post(`/createcomment`, body)
    .then((res) => {
        comments.innerHTML = `<h5>Comment Added!</h5>`
        axios.get(`/returncomments/${uid}`)
        .then((res) => {
            let commentsArr = res.data
            commentForum.innerHTML = ``
            for(i = 0; i < commentsArr.length; i++) {
    
                let commentItem = document.createElement('div')
                commentItem.classList.add('comment-card')
                commentItem.innerHTML = `
                <div class="comment-header">
                <h7>${commentsArr[i].username}:</h7>
                <h9>${commentsArr[i].date_posted}</h9>
                </div>
                <p>${commentsArr[i].content}</p>`
                commentForum.appendChild(commentItem)
            }
            
        }).catch((err) => {console.log(err)})
    }).catch((err) => {console.log(err)})
}

function resetToHome() {
    moreInfoSec.innerHTML = ``
    comments.innerHTML = ``
    navigation.innerHTML = ``
    searchResult.innerHTML = ``
    commentForum.innerHTML = ``
}

searchBtn.addEventListener("click", searchGene)