const {gql} = require('apollo-server');

module.exports = gql`
    type ShowPreview {
        id: ID!,
        name: String!
        genre: String!
        rating: Float!
        airdate: String
        airtime: String
        image: Image
    }
    
    type Episode {
       name: String,
       airdate: String,
       airtime: String,
       summary: String
    }
    
    type Show {
        name: String!,
        episodes(id: ID!): [Episode]!,
        summary: String
        image: Image
        network: Network
        cast(id: ID!): [Cast!]
    } 
    
    type Country {
        name: String!
    }
    
    type Network {
        name: String, 
        country: Country
    }
        
    type Image {
        medium: String!,
        original: String!
    }    
         
    type Cast {
       name: String!
    }
          
    type Query {
        schedule(settings: InputSettings!): [ShowPreview!]!
        show(id: ID!): Show!
        shows(q: String!): [ShowPreview!]!
    }
    
    input InputSettings {
        isNextWeek: Boolean!
        countryCode: String!
        rating: Int!
    }
`;
