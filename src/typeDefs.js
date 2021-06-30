const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        grocery(id: ID, name: String): Grocery
        groceries(category: String): [Grocery]
    }
    type Grocery {
        id: ID
        name: String
        category: String
    }
    type Mutation {
        createGrocery(input: CreateGroceryRequest!): CreateGroceryResponse
    }
    input CreateGroceryRequest {
        name: String!
        category: String!
    }
    type CreateGroceryResponse {
        grocery: Grocery
    }
`;

module.exports = typeDefs;