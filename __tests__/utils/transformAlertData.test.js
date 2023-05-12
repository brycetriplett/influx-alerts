const transformAlertData = require('@root/utils/transformAlertData')


test('transforms alert data correctly', () => {
    const inputData = {
      _check_name: 'test check',
      _level: 'crit',
      _message: 'test message',
      test_data1: '100',
      test_data2: '200'
    };

    const outputData = transformAlertData(inputData);
    expect(outputData).toEqual(
        `ALERT\n`+
        `test check has reached level: crit\n`+
        `message: test message\n`+
        `test_data1: 100\n`+
        `test_data2: 200\n`
    );
});