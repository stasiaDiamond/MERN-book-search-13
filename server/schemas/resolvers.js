const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query:{
        me: async(parents,args,context) =>{
            if(context.user){
                const foundUser = await User.findOne({_id: context.user._id });
            
                return foundUser
            }
            throw new AuthenticationError('Gotta log in!')
        }
    },

    Mutation: {

        login: async(parent, {email, password}) =>{
            const user = await User.findOne({email})

            if(!user){
                throw new AuthenticationError("Wrong info")
            }
            const correctPw = await user.isCorrectPassword(password)
            if(!correctPw){
                throw new AuthenticationError("Wrong info")
            }

            const token = signToken(user)

            return{ token, user }
        },
        addUser: async(parent, args) =>{
            const user = await User.create(args)
            const token = signToken(user);
            return{ token, user }
        },
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
        removeBook: async(parent, {bookId}, context) => {

            if(context.user){

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                    return updatedUser
            }
            throw new AuthenticationError('Gotta log in!')
        }
    }
}

module.exports = resolvers