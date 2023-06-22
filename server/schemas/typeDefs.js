const {gql} = require("apollo-server-express");

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String!        
        image: String
        title: String
        authors: [String]
        description: String
        link: String
    }

    input BookInput {
        bookId: String!
        image: String
        title: String!
        authors: [String]
        description: String!
        link: String
    }
    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput): User
        removeBook(bookId: String!): User
    }
`
// always export
module.exports = typeDefs;