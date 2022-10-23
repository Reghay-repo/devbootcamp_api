const advancedQueryResults = (model, populateOption) => async ( req,res,next) => {
    let query;

    // copy of req.query
    const reqQuery = { ...req.query };
    
    // convert query to string
    let queryStr = JSON.stringify(reqQuery);

    // select Fields to remove from fields 
    const removeFields = ['select','sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery;
    removeFields.forEach(param => delete reqQuery[param]);


    //create operators (gt,gte,lt,lte) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, match => `$${match}`);

    // find resource
    query = model.find(JSON.parse(queryStr));
    
    // select param
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query.select(fields);
    }

    // sort param
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query.sort(sortBy);
        console.log(query.sort);
    } else{ 
        query.sort('-createdAt');
    }

    // pagination 

    // parse to int the page param
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await  model.countDocuments();
    query = query.skip(startIndex).limit(limit);


    if(populateOption) {
        query.populate(populateOption);
    }

    const results = await query;

    // pagination results 
    const pagination = {};

    if(endIndex < total){

        pagination.next = {
            page:page+1,
            limit,
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page:page-1,
            limit,
        }
    }

    res.advancedResults = {
        success:true,
        count: results.length,
        pagination,
        data:results
    }
    next();

};




module.exports = advancedQueryResults;