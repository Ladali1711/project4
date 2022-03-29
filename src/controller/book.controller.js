const bookSchema = require('../model/book.model'); 
const httpService = require('../services/http-errors.service'); 
const moment = require('moment'); 

const createBook = async (req, res)=>{
    try{
        const data = req.body; 
        const { userId, releasedAt } = data; 
        if(!httpService.handleObjectId(userId)){
            return res.status(400).send({
                status: false,
                message: 'Only Object Id is allowed !'
            });
        } 
        if(releasedAt.length != 10){
            return res.status(400).send({
                status: false,
                message: '[YYYY-MM-DD] format is allowed !'
            });
        }
        /**
         * moment.ISO_8601 is used to remove warning from terminal to prevent valid format of date
         * @ isValid() return Boolean value
         */
        const validateDate = moment(moment(releasedAt, moment.ISO_8601).format('YYYY-MM-DD'),'YYYY-MM-DD',true).isValid(); 
        if(!validateDate){
            return res.status(400).send({
                status: false,
                message: '[YYYY-MM-DD] format is allowed !'
            });
        }
        const insertRes = await bookSchema.create(data);  
        return res.status(201).send({
            status: true,
            message: 'Book created successfully !',
            data: insertRes
        }); 
        
    } catch(error){
        httpService.handleError(res, error); 
    }
}

const getbook = async (req, res) => {
    try{
        const data = req.query;
        const filter = {
            isDeleted: false, 
            ...data
        }
        const book = await book.model.find(filter)
        if (book.length == 0){
            return res.status(400).send({status: false, msg: "no book "}) 
        }
        return res.status(201).send({status: true, data: book})
    }catch(e){
        res.status(400).send({status: false, msg: e.message})
    }
}

const updateBook = async (req, res) => {
    try{
        const id = req.params.blogId
        const data = req.body
        // res.send({id: id})
        const book = await bookModel.findOne({_id: id})
        // return res.send({Err: book})
        if (!book){
            return res.send({Err: "book not found"})
        }
        if (book.isDeleted == true){
            return res.status(400).send({status: false, msg: "this book is deleted"})
        }
        else{
            data.releasedAt = " "
        }
        if (data.isDeleted){
            data.deletedAt = moment().format()
        }
        // else{
        //     data.deletedAt = " "
        // }
        // data.updatedAt = moment().format()
        const updatedBook = await bookModel.findOneAndUpdate({_id: id}, data, {new: true})
        return res.status(201).send({status: true, msg: updatedBook})
    }catch(e){
        res.status(400).send({status: false, msg: e.message})
    }
}


module.exports = {
    createBook,
    getbook,
    updateBook
}