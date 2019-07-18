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

##  Leader Election How Work ?

```
In Raft there are two timeout settings which control elections.
 在raft中有两个超时设置控制选举。
 
 First is the election timeout.
 首先是选举超时。
 
 The election timeout is the amount of time a follower waits until becoming a candidate.
 选举超时是 follower 节点 等待 成为 candidate 节点
 
 The election timeout is randomized to be between 150ms and 300ms.
 选举超时随机设置在150ms到300ms之间。
 
 After the election timeout the follower becomes a candidate and starts a new election term...
 选举超时后，follower 成为 candidate 并开始新的选举任期…
 
 ...votes for itself...
 candidate 投票为它自己
 
 ...and sends out Request Vote messages to other nodes.
 …并向其他节点发送请求投票消息。

If the receiving node hasn't voted yet in this term then it votes for the candidate...
如果接收节点在这个任期内还没有投票，那么它将投票给候选人…

...and the node resets its election timeout.
…节点重置其选择超时。

Once a candidate has a majority of votes it becomes leader.
一旦candidate 获得多数票，他就成为 leader。

The leader begins sending out Append Entries messages to its followers.
leader 开始向其 followers 送附加条目消息。

These messages are sent in intervals specified by the heartbeat timeout.
这些消息以心跳超时指定的时间间隔发送。

Followers then respond to each Append Entries message.
然后，Followers 响应每个附加条目消息。

This election term will continue until a follower stops receiving heartbeats and becomes a candidate.
这个选举任期将持续到  follower停止接受心跳并成为候选人。

Let's stop the leader and watch a re-election happen.
让我们停下领袖的脚步，看着选举重演。

todo re-election
重新选举 和 节点异常

```
