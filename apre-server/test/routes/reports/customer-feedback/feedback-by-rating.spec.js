/**
 * Author: Diana Ruiz Garcia
 * Date: 16 November 2024
 * File: feedback-by-rating.spec.js
 * Description: Test the customer feedback API by rating
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the customer feedback API
describe('Apre Customer Feedback API - By Rating', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the feedback-by-rating endpoint
  it('should fetch average customer feedback for a specified rating', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              salespeople: [ 'Michael Scott', 'Andy Bernard', 'Meredith Palmer'],
              performanceMetrics: [ 140, 140, 150 ]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-rating/3'); // Send a GET request to the feedback-by-rating endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        salespeople: [ 'Michael Scott', 'Andy Bernard', 'Meredith Palmer'],
        performanceMetrics: [ 140, 140, 150 ]
      }
    ]);
  });

  // Test the feedback-by-rating endpoint if no rating is found
  it('should return 200 with an empty array if no rating is found', async () => {
    // Create a mock of the request and return data
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue([])
      };
      await callback(db);
    });

    // Send a GET request to the feedback-by-rating endpoint
    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-rating/');

    // Expect the status code to be 200
    expect(response.status).toBe(200);
    // Expect the response to be an empty array
    expect(response.body).toEqual([]);
  });

  // Test the feedback-by-rating endpoint with an invalid rating
  it('should return 400 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-rating/invalid-rating'); // Send a GET request to an invalid endpoint
    expect(response.status).toBe(400); // Expect a 500 status code
    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'rating is required',
      status: 400,
      type: 'error'
    });
  });
});