import winston from 'winston';

const { createLogger, transports, format } = winston;
const { combine, colorize, printf, json } = format;

const newLogger = (logLabel = ''): winston.Logger => {
	const customFormat = printf((msg): string => {
		const { timestamp, label, level, message, ...logObject } = msg;

		return `[${timestamp}] ${label} ${level}: ${message} ${logObject ? JSON.stringify(logObject, null, 2) : ''}`;
	});

	const logLevel = process.env.LOG_LEVEL || 'info';
	const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'local';
	const transportsOpt = isLocal
		? [new transports.Console({ format: combine(colorize(), customFormat) })]
		: [new transports.Console({ format: json() })];
	const formatOpts = isLocal
		? combine(format.label({ label: logLabel }), format.timestamp(), customFormat)
		: combine(format.label({ label: logLabel }), format.timestamp(), json());

	return createLogger({
		level: logLevel,
		format: formatOpts,
		transports: transportsOpt
	});
};

export default newLogger('Twitter Api Server');
