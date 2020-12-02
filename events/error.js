module.exports = async (client, app, error) => {
    client.logger.log(
        `An error event was sent by Discord.js: \n${JSON.stringify(error)}`,
        'error'
    );
};
