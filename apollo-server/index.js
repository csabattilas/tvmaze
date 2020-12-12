const {ApolloServer} = require('apollo-server');
const TvMazeApi = require('./datasources/tvmaze-api')
const resolvers = require('./resolvers/resolvers');
const typeDefs = require('./types/types');

const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    dataSources: () => ({
        tvMazeApi: new TvMazeApi()
    }),
});


// The `listen` method launches a web server.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
