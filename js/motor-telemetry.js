(function createIndustrialMotorTelemetry() {
  const NOMINAL_VOLTAGE = 230;
  const MAX_CURRENT_AMPS = 5;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round = (value, digits = 2) => Number(value.toFixed(digits));
  const readNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  const deterministicWave = (feed, index = 0) => {
    const rawSeed = readNumber(feed && feed.entry_id, 0) || Date.parse((feed && feed.created_at) || '') || index + 1;
    return Math.sin(rawSeed * 0.73) * 0.5 + Math.cos(rawSeed * 0.31) * 0.5;
  };

  const deriveInductionMotorValues = (feed = {}, index = 0) => {
    const voltage = round(readNumber(feed.field1, NOMINAL_VOLTAGE), 2);
    const temperature = round(readNumber(feed.field5, 68), 2);
    const wave = deterministicWave(feed, index);
    const voltageStress = clamp(Math.abs(voltage - NOMINAL_VOLTAGE) / 45, 0, 1.2);
    const warmStress = clamp((temperature - 64) / 24, 0, 1.35);
    const heatRisk = clamp((temperature - 74) / 14, 0, 1.4);
    const undervoltageBoost = clamp((210 - voltage) / 35, 0, 1.1);
    const loadFactor = clamp(0.42 + warmStress * 0.34 + voltageStress * 0.22 + heatRisk * 0.14 + wave * 0.05, 0.28, 1.25);
    const current = round(clamp(1.2 + loadFactor * 2.6 + undervoltageBoost * 0.7, 0, MAX_CURRENT_AMPS), 2);
    const vibration = round(clamp(0.75 + warmStress * 1.85 + voltageStress * 1.1 + heatRisk * 1.35 + Math.max(wave, 0) * 0.45, 0.5, 6.8), 2);
    const powerFactor = round(clamp(0.91 - warmStress * 0.075 - voltageStress * 0.08 - heatRisk * 0.045 - undervoltageBoost * 0.035 + wave * 0.012, 0.68, 0.92), 3);
    const apparentPower = round(voltage * current, 1);
    const power = round(apparentPower * powerFactor, 1);

    return {
      voltage,
      current,
      power,
      vibration,
      temperature,
      powerFactor,
      apparentPower,
      capturedAt: feed.created_at || new Date().toISOString(),
      created_at: feed.created_at || new Date().toISOString(),
      derived: true
    };
  };

  const normalizeFeed = (feed = {}, index = 0) => deriveInductionMotorValues(feed, index);
  const normalizeFeeds = (feeds = []) => feeds.map((feed, index) => normalizeFeed(feed, index));

  const assessInductionMotor = (data = {}) => {
    const alerts = [];
    const voltage = readNumber(data.voltage);
    const current = readNumber(data.current);
    const power = readNumber(data.power);
    const vibration = readNumber(data.vibration);
    const temperature = readNumber(data.temperature);
    const powerFactor = readNumber(data.powerFactor, 1);

    if (temperature >= 82) alerts.push(`Critical temperature ${temperature.toFixed(1)} °F: inspect cooling, bearing friction, and loading before continuing.`);
    else if (temperature >= 74) alerts.push(`Temperature near fault zone at ${temperature.toFixed(1)} °F: schedule inspection.`);

    if (vibration >= 5) alerts.push(`High vibration ${vibration.toFixed(2)} mm/s: possible bearing wear, imbalance, or misalignment.`);
    else if (vibration >= 3.2) alerts.push(`Vibration rising at ${vibration.toFixed(2)} mm/s: monitor bearing and mounting condition.`);

    if (current >= 4.5) alerts.push(`High current ${current.toFixed(1)} A: reduce load and check for mechanical drag.`);
    else if (current >= 4) alerts.push(`Current near overload at ${current.toFixed(1)} A: watch load and lubrication.`);

    if (voltage && (voltage <= 185 || voltage >= 260)) alerts.push(`Unsafe voltage ${voltage.toFixed(1)} V: verify supply before running the induction motor.`);
    else if (voltage && (voltage <= 205 || voltage >= 245)) alerts.push(`Voltage outside preferred band at ${voltage.toFixed(1)} V: current and heat may increase.`);

    if (powerFactor <= 0.74) alerts.push(`Low power factor ${powerFactor.toFixed(3)}: inspect load balance and motor efficiency.`);
    else if (powerFactor <= 0.79) alerts.push(`Power factor dropping to ${powerFactor.toFixed(3)}: motor is approaching inefficient operation.`);

    if (power >= 1000) alerts.push(`Power demand ${power.toFixed(0)} W is high for this motor profile.`);

    const severity = alerts.some((message) => /Critical|High vibration|High current|Unsafe voltage/.test(message))
      ? 'critical'
      : alerts.length
        ? 'warning'
        : 'info';

    return {
      severity,
      status: severity === 'critical' ? 'critical' : severity === 'warning' ? 'warning' : 'normal',
      alerts,
      summary: alerts[0] || 'Induction motor readings are in the normal operating band.'
    };
  };

  window.industrialMotorTelemetry = {
    normalizeFeed,
    normalizeFeeds,
    assessInductionMotor,
    MAX_CURRENT_AMPS
  };
})();
