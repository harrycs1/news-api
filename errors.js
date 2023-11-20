exports.handleCustomErrors = (err, req, res, next) => {
    if (err) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    console.log(err)
    if (err.code === "22P02") { // invalid text representation
        res.status(400).send({ msg: "Bad request" });
    }
    else if (err.code === "23502") { // violates not null
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err);
    }
}