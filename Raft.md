# Raft
```

```

## Leader Election 

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

## Log Replication 日志复制
```
All changes to the system now go through the leader.
对系统的所有更改现在都要经过 leader 节点
Each change is added as an entry in the node's log.
每个更改 都会添加为一个【记录】 在各个节点的日志中。
This log entry is currently uncommitted so it won't update the node's value.
此日志项当前未提交，因此它不会更新节点的值。
To commit the entry the node first replicates it to the follower nodes.
要提交 【记录】，节点首先将其复制到其跟随节点。
then the leader waits until a majority of nodes have written the entry.
然后，leader 节点等待，直到大多数节点写入【记录】。
The entry is now committed on the leader node and the node state is "5".
现在，【记录】已提交到leader节点上，节点状态为“5”。
The leader then notifies the followers that the entry is committed.
然后，leader 节点通知追随者该【记录】已提交。
The cluster has now come to consensus about the system state.
集群现在已经就系统状态达成共识。
This process is called Log Replication.
这个过程称为日志复制。
```
