const asyncErrorWrapper = require('express-async-handler');
const {
    
    searchHelper,
    paginationHelper

} = require("./queryMiddlewareHelpers");

const userQueryMiddleware = function(model,options){
    return asyncErrorWrapper(async function(req,res,next) {
        let query = model.find();
        // Search User By Name
        query = searchHelper("name",query,req);

        // Paginate User
        const total = await model.countDocuments()

        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;
        
        const queryResults = await query.find()

        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination,
            data : queryResults
        };

        next();
    })
};

module.exports = userQueryMiddleware;