export default {
  methods: {
    apollo(query, variables, target, queryName) {
      this.$apollo.query({
        query: query,
        variables: variables,
      }).then((result) => {
        this[target] = result.data[queryName].res
      })
    },

    apolloQuery(query, variables) {
      return this.$apollo.query({
        query: query,
        variables: variables,
        fetchPolicy: 'network-only'
      })
    },

    apolloMutation(mutation, variables) {
      return this.$apollo.mutate({
        mutation: mutation,
        variables: variables,
      })
    },

    fetchData(query, queryVaribales, subscription = undefined, subscriptionVariables = undefined) {
      return {
        query: query? this.$apollo.query({
          query: query,
          variables: queryVaribales,
          fetchPolicy: 'network-only'
        }) : null,

        obs: subscription? this.$apollo.subscribe({
          query: subscription,
          variables: subscriptionVariables,
          fetchPolicy: 'network-only'
        }) : null
      }
    }
  }
}