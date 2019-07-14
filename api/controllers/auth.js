var authController = {};

authController.authenticateLogin = function(req, res) {
    /**
     * TODO:
     * authenticate user against DB
     * if auth passes, initiate session and redirect to dashboard
     * else render login page with respective authentication failure messages.
     */
    
    console.log("User authentication passed.");
    res.redirect("/dashboard");
}

module.exports = authController;