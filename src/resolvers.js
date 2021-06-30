const {
    API_URL,
    fetchPromiseJsonOrErr,
    createNewError,
    checkIfError
} = require('./utilities');

const Query = {
    grocery: async (parent, args, context, info) => {
        const { id, name } = args;
        const { loaders } = context;
        let grocery;
        if (id) {
            grocery = await fetchPromiseJsonOrErr(`${API_URL}/groceries/id/${id}`);
        } else if (name) {
            grocery = await loaders.groceryLoader.load(name);
        } else {
            return createNewError('grocery Query requires a name or id parameter');
        }
        return checkIfError(grocery);
    },

    groceries: async (parent, args, context, info) => {
        const { category } = args;
        const { loaders } = context;
        let groceries;
        if (category) {
            groceries = await loaders.categoryLoader.load(category);
        } else {
            groceries = await loaders.allGroceriesLoader.load(
                'Unused parameter. The .load() method requires non-null.'
            );
        }
        return checkIfError(groceries);
    }
};
const Mutation = {
    createGrocery: async (parent, args, context, info) => {
        const { loaders } = context;
        const grocery = await fetchPromiseJsonOrErr(`${API_URL}/groceries`, 'POST', args.input)
            .then(grocery => {
                loaders.categoryLoader.clear(grocery.category);
                loaders.allGroceriesLoader.clearAll();
                return grocery;
            });
        return checkIfError(grocery, { grocery });
    }
}

module.exports = {
    Query,
    Mutation
};