const urlSchema = require('../Model/urlModel');
const crypto = require('crypto');

const createShortURL = async (req, res) => {
    try {
        const data = req.body;
        const key = Object.keys(data);
        if (key.length > 0) {
            if (!(key.length == 1 && key == 'longUrl')) {
                return res.status(400).send({
                    status: false,
                    message: 'Only longUrl field is allow !'
                });
            }
        }
        let urlCode = crypto.randomBytes(6).toString('base64');

        urlCode = await uniqueUrlCode(urlCode);

        const domain = req.protocol + "://" + req.get('host');
        const shortUrl = domain + "/" + urlCode;

        data.urlCode = urlCode;
        data.shortUrl = shortUrl;

        const dataRes = await urlSchema.create(data);
        return res.status(201).send({
            status: true,
            message: 'success',
            data: dataRes
        })
    } catch (error) {
        if (error['errors'] != null) {
            const key = Object.keys(error['errors']);
            return res.status(400).send({
                status: false,
                message: error['errors'][key[0]].message
            });
        }
        return res.status(500).send({
            status: false,
            message: error
        });
    }
}

async function uniqueUrlCode(urlCode) {
    const checkRes = await urlSchema.findOne({
        urlCode: urlCode
    });
    if (checkRes != null) {
        const urlCode = crypto.randomBytes(4).toString('base64');
        uniqueUrlCode(urlCode);
    }
    else {
        return urlCode;
    }
}

const redirectToOriginalURL = async (req, res) => {
    try {
        const urlCode = req.params.urlCode;
        if (urlCode.length != 8) {
            return res.status(400).send({
                status: false,
                message: 'Please enter a valid urlCode !'
            });
        }
        const urlRes = await urlSchema.findOne({
            urlCode: urlCode
        });
        if (!urlRes) {
            return res.status(404).send({
                status: false,
                message: 'URL not found !'
            });
        }
        res.redirect(301, urlRes.longUrl);
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error
        });
    }
}

module.exports = {
    createShortURL,
    redirectToOriginalURL
}

// const urlModel = require("../model/urlModel")
// const validUrl = require('valid-url')
// const shortid = require('shortid')
// const baseUrl = 'http:localhost:3000'
// const createUrl =  async (req, res) => {
//     const {
//         longUrl
//     } = req.body 

    
//     if (!validUrl.isUri(baseUrl)) {
//         return res.status(401).send('Invalid base URL')
//     }
    
//     const urlCode = shortid.generate()

    
//     if (validUrl.isUri(longUrl)) {
//         try {

//             let url = await urlModel.findOne({
//                 longUrl
//             })

           
//             if (url) {
//                 res.send(url)
//             } else {
               
//                 const shortUrl = baseUrl + '/' + urlCode

//                 url = new urlModel({
//                     longUrl,
//                     shortUrl,
//                     urlCode,
//                     date: new Date()
//                 })
//                 await url.save()
//                 res.send(url)
//             }
//         }
        
//         catch (err) {
//             console.log(err)
//             res.status(500).send('Server Error')
//         }
//     } else {
//         res.status(401).send('Invalid longUrl')
//     }
// }
 
// const get = async (req, res) => {
//     try {
        
//         const url = await urlModel.findOne({
//             urlCode: req.params.code
//         })
//         if (url) {
            
//             return res.redirect(url.longUrl)
//         } else {
           
//             return res.status(404).send('No URL Found')
//         }

//     }
    
//     catch (err) {
//         console.error(err)
//         res.status(500).send('Server Error')
//     }
// }
// module.exports.createUrl = createUrl;
// module.exports.get = get;