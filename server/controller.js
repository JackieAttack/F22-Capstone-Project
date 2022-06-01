require("dotenv").config();
const Sequelize = require("sequelize");
const axios = require('axios');

const{CONNECTION_STRING} = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})


const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'

module.exports = {

    searchGeneId: (req, res) => {
        const {term} = req.params
        axios.get(`${baseURL}esearch.fcgi?db=gene&term=${term}&retmode=json&sort=relevance`)
            .then((dbres) => {
                let geneIds = dbres.data.esearchresult.idlist.slice(0, 20).join(",")

                //get gene info
                axios.get(`${baseURL}esummary.fcgi?db=gene&id=${geneIds}&retmode=json`)
                .then((mdres) => {
                    let searchArr = Object.values(mdres.data.result)
                    res.status(200).send(searchArr)

                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {console.log(err)})
        },
    seed: (req, res) => {
        sequelize.query(
                `
                DROP TABLE IF EXISTS comments;
                    
                CREATE TABLE comments (
                comment_id SERIAL PRIMARY KEY,
                uid INTEGER,
                content TEXT,
                date_posted TIMESTAMP DEFAULT NOW(),
                username VARCHAR(50)
            );`)
            .then(() => {
            console.log("Database seeded.")
            res.sendStatus(200)
        }).catch((err) => {console.log(err)})
    },
    
    postComment: (req, res) => {
        const {uid, name, text} = req.body

        sequelize.query(`
        INSERT INTO comments(uid, content, username)
        VALUES(${uid}, '${text}', '${name}');`)
        .then((dbRes) => {
            res.status(200).send(dbRes[0])
        }).catch((err) => {console.log(err)})
    },

    returnComments: (req, res) => {
        let {uid} = req.params
        uid = +uid

        sequelize.query(`
        SELECT * FROM comments
        WHERE uid = ${uid};
        `).then((dbRes) => {
            res.status(200).send(dbRes[0])
        }).catch((err) => {console.log(err)})
    }
}