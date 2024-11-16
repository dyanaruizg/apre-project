/**
 * Author: Diana ruiz Garcia
 * Date: 16/11/2024
 * File: feedback-by-rating.js
 * Description: Apre customer feedback API for the customer feedback by rating report
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /agent-performance-by-supervisor
 *
 * Fetches a list of distinct customer feedback ratings.
 *
 * Example:
 * fetch('/feedback-by-rating')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/feedback-by-rating', (req, res, next) => {
  try {
    mongo (async db => {
      const ratings = await db.collection('customerFeedback').distinct('rating');
      res.send(ratings);
    }, next);
  } catch (err) {
    console.error('Error getting ratings: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /feedback-by-rating/:rating
 *
 * Fetches average customer feedback for a specified rating.
 *
 * Example:
 * fetch('/feedback-by-rating/5')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/feedback-by-rating/:rating', (req, res, next) => {
  try {
    const rating = req.params.rating;

    if (!rating || isNaN(rating)) {
      return next(createError(400, 'rating is required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        { $match: { rating: Number(rating) }},
        {
          $group: {
            _id: "$salesperson",
            totalPerformanceMetrics: { $sum: '$performanceMetrics'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            performanceMetrics: '$totalPerformanceMetrics'
          }
        },
        {
          $group: {
            _id: null,
            salespeople: { $push: '$salesperson' },
            performanceMetrics: { $push: '$performanceMetrics' }
          }
        },
        {
          $project: {
            _id: 0,
            salespeople: 1,
            performanceMetrics: 1
          }
        }
      ]).toArray();
      console.log("customer feedback: ", data);
      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error getting customer feedback data for rating', err);
    next(err);
  }
});

module.exports = router;