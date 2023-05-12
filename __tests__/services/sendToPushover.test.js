// Mock the axios module
jest.mock('axios');

const axios = require('axios');
const sendToPushover = require('@root/services/sendToPushover');

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

test('sendToPushover sends a post request to the Pushover API', async () => {
  // Arrange
  const message = 'Test message';

  // Mock axios.post to resolve to an empty object
  axios.post.mockResolvedValue({ data: {} });

  // Act
  await sendToPushover(message);

  // Assert
  expect(axios.post).toHaveBeenCalledWith(
    'https://api.pushover.net/1/messages.json',
    {
      token: process.env.PUSHOVER_API_TOKEN,
      user: process.env.PUSHOVER_USER_KEY,
      message
    }
  );

  // Reset axios mock after each test
  axios.post.mockReset();
});
