# Architecture

## Overview
### nginx
+ Directly serves static webclient
+ Proxies API

Depends on: API
Scalability: Single process per node, infinite nodes via load-balancer

### API
+ Handles API requests
+ Provides dumb websocket server for change relay

Depends on: neo4j
Scalability: Infinite process per node with dynamic port mapping pending redis for socket.io clustering

### neo4j
+ Persistence and relationship management of nodes

Depends on: N/A
Scalability: No gain from multiple processes per node, but possible

### WebClient
+ Provides UI and query interface, displays graphs
+ Receives changes stream either over Websocket or http polling fallback provided by Socket.io
+ Is served by nginx

Runs via nginx

### worker
+ Provides random changes in neo4j to simulate data modification
+ Relays changes through API

Depends on: neo4j, API
Scalability: Infinite processes up to Socket.io max thoroughput (limited by API instance count)

## Change Handling

Original spec recommends letting server persist client state and stream only relevant changes to client. However this violates the statelessness of the API (forcing either storing client state in a third party store or forcing client stickyness to API instance) and hurts per-instance scalability, in general resulting in less flexibility for the client.

Instead clients are notified of all changed nodes in an opt-in streaming format allowing clients to handle updates on a per platform case. Mobile clients can update less often (restricting updates further depending on current network type and speed) while allowing desktop clients to update as frequently as desired. Further clients no longer have to synchronize state with the server and can thus cache locally, merge multiple requests outputs together (exploring down a chain of nodes as need be for instance) and in general act independently.

Downside of modified approach includes higher total outbound traffic from API, at the upside of significantly less server level cpu and memory usage.

## Viewing large graphs

The client only receives (and only displays) the beginning and end of relationships in their specified depth. E.g. their query looks like:

```
MATCH (d:Domain{id:'420.notavirus.co.uk'})
OPTIONAL MATCH p=(d)-[r:HAS*1..2]-(c)
RETURN d.id as source, collect(distinct c.id) as nodes, collect(distinct {source: d.id, target: c.id}) as links
```
*(where the 2 in `1..2` represents our max depth)*

Since we only return d and c in an object, the intermediary nodes are hidden. An alternative would be to modify our RETURN statement to instead return `nodes(p)` and write a transform to take each path and break it into an array of pairs, then flattening the return.

However, in our sample data set, the relationship behavior (and in general for well connected graphs) is exponential, meaning each depth adds in a substantial amount of nodes. By keeping our middle layers hidden we show the relationships but keep our total data size and drawing effort low.

In a production environment it's likely both styles of display are useful, and therefore the ability to request both styles are desirable. Realistically the only modification is to the API layer, the webclient only needs the UI elements to allow switching between the styles.
