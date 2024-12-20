

const searchHelper = (searchKey,query,req) => {
    // Search
    if (req.query.search) {
        const searchObject = {}
        // title serchValue
        const regex = new RegExp(req.query.search, "i")
        searchObject[searchKey] = regex

        return query.where(searchObject)
    }
    return query
};
const populateHelper = (query,population) => {
    return query.populate(population);
}
const questionSortHelper = (query,req) => {

    const sortKey = req.query.sortBy

    if(sortKey === "most-answerd") {
        query = query.sort("-answersCount")
    }

    if(sortKey === "most-liked") {
        return query.sort("-likeCount")
    }
    return query.sort("-createdAt")
}
const paginationHelper = async (totalDocuments,query,req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
 
    const pagination = {}
    const total = totalDocuments
    
    if (startIndex > 0 ) {
        pagination.prev = {
            page : page - 1,
            limit: limit
        }
    }
    if (endIndex < total){
        pagination.next = {
            page : page + 1,
            limit: limit
        }
    }
    return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination : pagination,
        startIndex,
        limit
    }
    
}
module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
    
};