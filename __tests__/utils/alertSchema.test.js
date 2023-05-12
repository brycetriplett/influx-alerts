const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const alertSchema = require('@root/utils/alertSchema');

const ajv = new Ajv();
addFormats(ajv);


test('valid alert is accepted by the schema', () => {
    const validAlert = {
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
  
    const validate = ajv.compile(alertSchema);
    const valid = validate(validAlert);
  
    expect(valid).toBeTruthy();
  });

  test('invalid alert is rejected by the schema', () => {
    const validAlert = {
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
  
    const validate = ajv.compile(alertSchema);
    const valid = validate(validAlert);
  
    expect(valid).toBeFalsy();
  });
  