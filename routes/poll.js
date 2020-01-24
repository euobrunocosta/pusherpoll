const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Vote = require('../models/Vote')

const Pusher = require('pusher')

var pusher = new Pusher({
    appId: '931085',
    key: '7fab49c618737422f210',
    secret: 'a89d2f7323157786f990',
    cluster: 'us2',
    encrypted: true
})

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, votes}))
})

router.post('/', (req, res) => {

    const newVote = {
        os: req.body.os,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points:  parseInt(vote.points),
            os: vote.os
        })
        return res.json({success: true, message: 'Thank you for voting in ' + req.body.os})
    })
})

module.exports = router