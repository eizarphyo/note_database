class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        // FILTERING
        const qureyObj = { ...this.queryStr };

        // EXCLUDE FIELDS
        const excludeFields = ['page', 'sort', 'fields', 'limit'];
        excludeFields.forEach((el) => delete qureyObj[el]);
        // console.log(req.query, qureyObj);

        // ADVANCED FILTERING
        let queryObjStr = JSON.stringify(qureyObj);
        queryObjStr = queryObjStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(queryObjStr);

        this.query = this.query.find(JSON.parse(queryObjStr));  // BUILD Query
        return this;
    }

    // SORTING
    sort() {
        // http://localhost:3000/api/v1/tours?sort=price
        if (this.queryStr.sort) {
            this.query = this.query.sort(this.queryStr.sort.split(',').join(" ")); // multiple sorting
        } else {
            this.query = this.query.sort("-createdAt");  // default sorting
        }
        return this;
    }

    // SELECTING the FIELDS
    select() {
        // http://localhost:3000/api/v1/tours?fields=price,name,difficulty
        if (this.queryStr.fields) {
            this.query = this.query.select(this.queryStr.fields.split(',').join(" "));
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    // PAGINATION
    paginate() {
        // http://localhost:3000/api/v1/tours?page=2&limit=3
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 20;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;