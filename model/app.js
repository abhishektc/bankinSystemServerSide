const db = require("../config/config");

module.exports = {

    transactions: (req, res) => {
        db('account')
            .orderBy('accountId', "desc")
            .where({ userId: req.body.userId })
            .first()
            .then(row => {
                if (req.body.option === 'deposit') {
                    let amount = JSON.parse(req.body.amount);
                    if (row) {
                        amount = row.totalBalance + JSON.parse(req.body.amount);
                    }
                    db('account').insert({
                        userId: req.body.userId,
                        mode: req.body.option,
                        amount: req.body.amount,
                        totalBalance: amount,
                        date: new Date()
                    })
                        .then(data => {
                            res.status(200).json({
                                success: 1,
                                message: "Amount Deposited Successfully"
                            })
                        })
                        .catch(error => res.status(500).json({
                            success: 0,
                            error: "Error"
                        })
                        )
                } else if (req.body.option === 'withdraw') {
                    if (!row) {
                        res.status(409).json({
                            success: 0,
                            error: 'INSUFICIENT'
                        })
                    } else {
                        if (req.body.amount <= row.totalBalance) {
                            const amount = row.totalBalance - JSON.parse(req.body.amount);
                            db('account').insert({
                                userId: req.body.userId,
                                mode: req.body.option,
                                amount: req.body.amount,
                                totalBalance: amount,
                                date: new Date()
                            })
                                .then(data => {
                                    res.status(200).json({
                                        success: 1,
                                        message: "Amount withdraw Successfully"
                                    })
                                })
                                .catch(error => res.status(500).json({
                                    success: 0,
                                    error: "Error"
                                })
                                )
                        } else {
                            res.status(409).json({
                                success: 0,
                                error: 'INSUFICIENT'
                            })
                        }
                    }
                }
            });

    },

    getTransactionList: (req, res) => {
        db('account')
            .orderBy('date', "desc")
            .where({ userId: req.params.id })
            .then(data => {
                res.status(200).json({
                    success: 1,
                    data: data
                })
            })
            .catch(error => {
                res.status(500).json({
                    success: 0,
                    error: "Something went wrong!"
                })
            })
    },

    getUsersList: (req, res) => {
        var subquery = db('account').max('account.accountId').groupBy('account.userId');
        db('user')
            .join('account','user.userId','account.userId')
            .select('user.userId','user.name','account.totalBalance')
            .whereIn('account.accountId',subquery)
            .groupBy('account.userId')
            .then(data => {
                res.status(200).json({
                    success: 1,
                    data: data
                })
            })
            .catch(error => {
                res.status(500).json({
                    success: 0,
                    error: "Something went wrong!"
                })
            })
    },

};