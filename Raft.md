# Raft
```

```

# Leader Election && Node

```
A node can be in 1 of 3 states:
The Follower state, the Candidate state, or the Leader state.


All our nodes start in the follower state.
If followers don't hear from a leader then they can become a candidate.
The candidate then requests votes from other nodes.
Nodes will reply with their vote.
The candidate becomes the leader if it gets votes from a majority of nodes.

This process is called Leader Election.

```
