const alertSchema = {
    type: 'object',
    properties: {
      _check_id: { type: 'string' },
      _check_name: { type: 'string' },
      _level: { type: 'string' },
      _measurement: { type: 'string' },
      _message: { type: 'string' },
      _notification_endpoint_id: { type: 'string' },
      _notification_endpoint_name: { type: 'string' },
      _notification_rule_id: { type: 'string' },
      _notification_rule_name: { type: 'string' },
      _source_measurement: { type: 'string' },
      _source_timestamp: { type: 'number' },
      _start: { type: 'string', format: 'date-time' },
      _status_timestamp: { type: 'number' },
      _stop: { type: 'string', format: 'date-time' },
      _time: { type: 'string', format: 'date-time' },
      _type: { type: 'string' },
      _version: { type: 'number' },
      agent_host: { type: 'string' },
      ambient_temperature: { type: 'number' },
      host: { type: 'string' },
    },
    required: [
      '_check_name',
      '_level',
      '_message',
    ],
  };


module.exports = alertSchema;