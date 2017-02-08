const { join } = require('path');
const { EXCHANGE_TYPE, EXCHANGES_AVAILABLE } = require('./constants');

function parseQualifier(qualifier) {
    const [
        type,
        routingKey,
        queueName
    ] = qualifier.split('/');

    return {
        queueName: queueName || '',
        routingKey: routingKey || '',
        type: type || EXCHANGE_TYPE.DIRECT
    };
}

function getPackageJson() {
    try {
        // eslint-disable-next-line
        return require(join(process.env.PWD, 'package.json'));
    } catch (err) {
        return {};
    }
}

function getExchangeName(options) {
    if (options.exchangeName) {
        return options.exchangeName;
    }

    if (!!options.type && EXCHANGES_AVAILABLE.includes(options.type)) {
        return `amq.${options.type}`;
    }

    return '';
}

function getQueueName(options, config) {
    if (options.type === EXCHANGE_TYPE.DIRECT) {
        return options.routingKey;
    }
    if (config.serviceName) {
        return `${config.serviceName}:${options.queueName}`;
    }
    if (options.serviceName) {
        return `${options.serviceName}:${options.queueName}`;
    }
    return '';
}

function parseSubscriptionOptions(options, qualifier) {
    options = Object.assign({
        routingKey: '',
        durable: true,
        queue: {},
        exchange: {}
    }, options, parseQualifier(qualifier));

    options.exchange = Object.assign({
        exclusive: false,
        durable: true
    });

    options.exchange = Object.assign({
        durable: true
    });

    return options;
}

module.exports = {
    parseQualifier,
    parseSubscriptionOptions,
    getPackageJson,
    getExchangeName,
    getQueueName
};
