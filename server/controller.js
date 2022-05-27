const axios = require('axios');

const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'

let searchArr = []

module.exports = {

    searchGeneId: (req, res) => {
        const {term} = req.params
        axios.get(`${baseURL}esearch.fcgi?db=gene&term=${term}&retmode=json&sort=relevance`)
            .then((dbres) => {
                let geneIds = dbres.data.esearchresult.idlist.slice(0, 20).join(",")

                //get gene info
                axios.get(`${baseURL}esummary.fcgi?db=gene&id=${geneIds}&retmode=json`)
                .then((mdres) => {
                    searchArr = Object.values(mdres.data.result)
                    res.status(200).send(searchArr)

                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {console.log(err)})
        }
}