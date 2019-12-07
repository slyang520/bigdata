
# 高可用 （redis V3+）

# 1.Master-slave 主从
```
主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。
前者称为主节点(master)，后者称为从节点(slave)；数据的复制是单向的，只能由主节点到从节点
```
```
master  127.0.0.1:6379
slave   127.0.0.1:6479  
# 启动从节点
1: redis-server ./redis.conf
2: redis-cli -p 6479
# 将6479配置为 6379 的重节点(ok代表成功)
3: slaveof 127.0.0.1 6379

# 主节点查看从节点信息
1: redis-cli
2: info replication

从节点配置的3种方式，以上演示的是 (3)
（1）配置文件
在从服务器的配置文件中加入：slaveof <masterip> <masterport>
（2）启动命令
redis-server启动命令后加入 --slaveof <masterip> <masterport>
（3）客户端命令
 通过客户端执行命令：slaveof <masterip> <masterport>
```
# 2.哨兵
```
主从复制存在的一个问题是故障恢复无法自动化。它基于Redis主从复制，
主要作用便是解决主节点故障恢复的自动化问题，进一步提高系统的高可用性。

Redis Sentinel，即Redis哨兵，在Redis 2.8版本(相关术语)

监控（Monitoring）：哨兵会不断地检查主节点和从节点是否运作正常。
自动故障转移（Automatic failover）：当主节点不能正常工作时，哨兵会开始自动故障转移操作，它会将失效主节点的其中一个从节点升级为新的主节点，并让其他从节点改为复制新的主节点。
配置提供者（Configuration provider）：客户端在初始化时，通过连接哨兵来获得当前Redis服务的主节点地址。
通知（Notification）：哨兵可以将故障转移的结果发送给客户端（比如java-client jedis）。


哨兵部署架构
它由两部分组成，哨兵节点和数据节点：
哨兵节点：哨兵系统由一个或多个哨兵节点组成，哨兵节点是特殊的redis节点，不存储数据。
数据节点：主节点和从节点都是数据节点。

```

# 3. 集群(Cluster)  TODO
```
最主要的问题是存储能力受单机限制，以及无法实现写操作的负载均衡.
```



# doc 

```
https://www.cnblogs.com/kismetv/p/9609938.html
```
