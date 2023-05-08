import { pubsub } from './index'

let n = 0

setInterval(() => {
    n++
    pubsub.publish('TEST_SUBSCRIPTION', { TestSubscription: { value: n } })
}, 5 * 1000)

export const SubsTypeDefs = `#graphql

type Subs {
    value: Int
}

type Subscription {
    TestSubscription: Subs
}`

export const SubsResolvers = {
    Subscription: {
        TestSubscription: {
            subscribe: () => pubsub.asyncIterator(['TEST_SUBSCRIPTION'])
        }
    }
}
