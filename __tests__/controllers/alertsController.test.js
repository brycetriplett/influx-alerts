const postAlert = require('@root/controllers/postAlert');
const sendToPushover = require('@root/services/sendToPushover');
const transformAlertData = require('@root/utils/transformAlertData');


jest.mock('@root/services/sendToPushover');
jest.mock('@root/utils/transformAlertData');

describe('postAlert', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        _check_name: 'test check',
        _level: 'crit',
        _message: 'test message',
        test_data1: '100',
        test_data2: '200'
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn(),

    transformedData = `ALERT\n` +
      `test check has reached level: crit\n` +
      `message: test message\n` +
      `test_data1: 100\n` +
      `test_data2: 200\n`;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the alert to Pushover and respond with 200 if successful', async () => {
    transformAlertData.mockReturnValue(transformedData);
    sendToPushover.mockResolvedValue('Pushover response');
  
    await postAlert(req, res, next);
  
    expect(transformAlertData).toHaveBeenCalledWith(req.body);
    expect(sendToPushover).toHaveBeenCalledWith(transformedData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Alert Forwarded' });
    expect(next).not.toHaveBeenCalled();
  });

  
  it('should call next with an error if the alert data is invalid', async () => {
    const validationError = new Error('Invalid alert data format.');

    req = {
      body: {},
    };

    await postAlert(req, res, next);

    expect(next).toHaveBeenCalledWith(validationError);
    expect(sendToPushover).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should call next with an error if forwarding the message fails', async () => {
    const error = new Error('Failed to forward message');
  
    transformAlertData.mockReturnValue(transformedData);
    sendToPushover.mockRejectedValueOnce(error);
  
    await postAlert(req, res, next);
  
    expect(transformAlertData).toHaveBeenCalledWith(req.body);
    expect(sendToPushover).toHaveBeenCalledWith(transformedData);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
