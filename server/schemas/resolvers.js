const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {

    Query: {
        // user authentication
        me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id });

            return userData;
        }
        throw new AuthenticationError("Gotta log in!");
        },
    },

    Mutation: {
        // login authentication
        login: async (parent, { email, password }) => {

        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError("Nope, try again");
        }
        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
            throw new AuthenticationError("Nope, try again");
        }

        const token = signToken(user);
        return { token, user };
        },

        // adding/creating user
        addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
        },
        // saving book
        saveBook: async(parent,{bookData}, context) =>{
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                    );
                    return updatedUser;
            }
            throw new AuthenticationError('Gotta log in!')

        },
        // deleting book and updating user 
        removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError("Gotta log in!");
        },
    },
};

module.exports = resolvers;