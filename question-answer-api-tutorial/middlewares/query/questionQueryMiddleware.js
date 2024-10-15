const asyncErrorWrapper = require('express-async-handler');
const {
    
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper

} = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function(model,options){
    return asyncErrorWrapper(async function(req,res,next) {
        // Initial Query
        let query = model.find({});

        // Search Parameter
        query = searchHelper("title",query,req);
        
        // Populate If Available
        
        if (options && options.population) {
            query = populateHelper(query,options.population);
        }
        // Sort Question

        query = questionSortHelper(query,req);

        let pagination;

        // Paginate Question
        const total = await model.countDocuments()
        
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;

        pagination = paginationResult.pagination;
        
        const queryResults = await query;
        console.log(pagination);
        
        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };
        next();
    })
};

module.exports = questionQueryMiddleware;