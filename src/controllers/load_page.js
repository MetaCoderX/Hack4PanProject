exports.loadIndex = (req, res, next) => {
    console.log(req.param.pages);
    res.render(req.param.pages);
}
