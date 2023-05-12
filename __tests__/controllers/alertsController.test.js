const { postAlert } = require('@root/controllers/alertsController');
const sendToPushover = require('@root/services/sendToPushover');
const httpMocks = require('node-mocks-http');

jest.mock('@root/services/sendToPushover');

describe('postAlert', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    sendToPushover.mockClear();
  });

  describe('postAlert', () => {
    // ...rest of your setup...
  
    test('validates alert data - valid case', async () => {
      // Set up your req.body with valid alert data here
      req.body = {
        _check_id: '0a79db80e1d83000',
        _check_name: 'testing',
        _level: 'crit',
        _measurement: 'notifications',
        _message: 'Check: testing is: crit',
        _notification_endpoint_id: '0b2c74b32b490000',
        _notification_endpoint_name: 'express backend',
        _notification_rule_id: '09500bc829b05000',
        _notification_rule_name: 'critical',
        _source_measurement: 'snmp',
        _source_timestamp: 1683658080000000000,
        _start: '2023-05-09T18:47:00Z',
        _status_timestamp: 1683658080000000000,
        _stop: '2023-05-09T18:49:00Z',
        _time: '2023-05-09T18:49:00Z',
        _type: 'threshold',
        _version: 1,
        agent_host: '172.16.2.158',
        ambient_temperature: 32,
        host: 'influxdb',
      };
  
      await postAlert(req, res, next);
  
      // Check that sendToPushover was called
      expect(sendToPushover).toHaveBeenCalled();
  
      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });
  
    test('validates alert data - invalid case', async () => {
      // Set up your req.body with invalid alert data here
      req.body = {
        _check_id: '0a79db80e1d83000',
        _measurement: 'notifications',
        _notification_endpoint_id: '0b2c74b32b490000',
        _notification_endpoint_name: 'express backend',
        _notification_rule_id: '09500bc829b05000',
        _notification_rule_name: 'critical',
        _source_measurement: 'snmp',
        _source_timestamp: 1683658080000000000,
        _start: '2023-05-09T18:47:00Z',
        _status_timestamp: 1683658080000000000,
        _stop: '2023-05-09T18:49:00Z',
        _time: '2023-05-09T18:49:00Z',
        _type: 'threshold',
        _version: 1,
        agent_host: '172.16.2.158',
        ambient_temperature: 32,
        host: 'influxdb',
      };
  
      await postAlert(req, res, next);
  
      // Check that sendToPushover was not called
      expect(sendToPushover).not.toHaveBeenCalled();
  
      // Check that next was called with an error
      expect(next).toHaveBeenCalledWith(new Error('Invalid alert data format.'));
    });
  });

  test('transforms alert data', async () => {
    // Set up your req.body with specific alert data here
    req.body = { /* specific alert data */ };

    await postAlert(req, res, next);

    // Assertions here...
  });

  test('sends alert to Pushover', async () => {
    // Set up your req.body with specific alert data here
    req.body = { /* specific alert data */ };

    await postAlert(req, res, next);

    // Check that sendToPushover was called with the correct arguments
    expect(sendToPushover).toHaveBeenCalledWith(/* expected transformed data */);
  });

  test('handles errors when sending alert to Pushover', async () => {
    // Set up your req.body with specific alert data here
    req.body = { /* specific alert data */ };

    // Mock sendToPushover to throw an error
    sendToPushover.mockImplementation(() => {
      throw new Error();
    });

    await postAlert(req, res, next);

    // Check that next was called with an error
    expect(next).toHaveBeenCalledWith(new Error('Failed to forward message'));
  });
});
