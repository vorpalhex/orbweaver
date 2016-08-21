# Web
## Issues

  + Changes only consider visible end nodes

  At depths > 1, our webclient is only displaying the edges of each relationship. We do this for drawing performance reasons given our exponential node count as depth increases. However we could store our entire path in memory and then check our changes against that. While the amount of nodes posses issues for drawing, running a union between our graphs is sufficiently cheap to allow high amounts of nodes.

  + No partial updates

  We clear the graph and rebuild it whenever relevant changes are detected. This implementation is simply stop-gap, and should be replaced with an algorithm to detect new nodes and add them one by one, and detect lost nodes and remove them.

  Alternatively a double buffering strategy could be used which would give the same visual effect and present a linear draw time, though potentially that linear time would be higher on average than the strategy suggested above.

## Enhancements
  + Ability to follow a node

  It'd be nice to be able to click on a node and rebuild the graph as if that node were our original search. For UI reasons we should keep a short history and a way to jump back to previously visited nodes (backspace on the keyboard as well as a UI button)

  + Better WCAG support/Accessibility in general

  + SSL Support (Let's Encrypt)

# API
## Issues
+ Current driver has issues with some parameterized requests. Fix: Switch to the base neo4j driver.
+ No Auth (Fine for demo, not production ready)

## Enhancements
+ Tie Socket.io to redis for clustering, allowing API to be scaled as need be.
+ SSL Support (Likely at nginx level)
+ Support for listing and searching by IPs

# Worker
## Issues

## Enhancements
+ Mess with more things
+ Support socket disconnects and reconnects, queueing changes
+ Move away from Socket to a Queue service such as RabbitMQ, etc

This would help scalability (less Socket noise, let a single worker dump from the queue to socket) and would also allow dynamic worker control from either a control service or the API itself (potentially scaling for load)

# Docker/Setup
## Issues
+ neo4j image doesn't boot reliably

Despite being the official entirely untouched neo4j image, sometimes it doesn't boot. Fix for this is to build a custom image, or wait for a core patch. Seems to be tied to race condition?

+ neo4j has no Auth

neo4j has a default auth, but requires a password change prior to usage. For our use case (it's running purely against localhost, highly isolated) it's fine for demo purposes to disable auth, but not production quality.

+ neo4j has no SSL enabled

+ No Dynamic hostname support

## Enhancements

+ Log management
+ Monitoring
