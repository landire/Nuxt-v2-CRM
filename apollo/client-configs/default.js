import { ApolloLink, concat, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import 'subscriptions-transport-ws'

const jwt = require('jsonwebtoken')

export default ({ ctx, store, $config: { apolloHttp, apolloWs, jwtSecret } }) => {

  const getToken = () => {
    const token = jwt.sign({ user: 'User', exp: Math.floor(Date.now() / 1000) + 20 }, jwtSecret)
    return token
  }

  const httplink = new HttpLink({ uri: apolloHttp })

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${store.getters.token}`,
        // Aus: `Bearer ${getToken()}`
      }
    })
    return forward(operation)
  })

  const wsLink = process.browser ? new WebSocketLink({
    uri: apolloWs,
    options: {
      reconnect: true,
      connectionParams: () => {
        return {
          Authorization: `Bearer ${store.getters.token}`,
          // Aus: `Bearer ${getToken()}`
        }
      }
    }
  }) : null

  const link = process.browser ? split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httplink,
  ) : httplink


  return {
    link: concat(authMiddleware, link),
    cache: new InMemoryCache(),
    defaultHttpLink: false,
  }
}
