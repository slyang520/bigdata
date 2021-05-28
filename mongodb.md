Mongodb 分片（Sharding）模式

```
​ Mongos：Mongos我们可以理解为整个集群的入口
​ Shard：分片，存储真实的数据
​ ConfigServer：在集群中扮演存储整个集群的配置信息

https://segmentfault.com/a/1190000039142073
https://juejin.cn/post/6847902223066742798
https://blog.csdn.net/qq_39187019/article/details/113060474
```

| 角色 | ip | 端口 | 备注 |
|  ----  | ----  |  ----  |  ----  |
| config_s1 | ip1 | 27117 | --configsvr --replSet "rs_config_server" |
| shard1_s1 | ip1         | 27217 | --shardsvr --replSet "rs_shard1" |
| shard2_s1 | ip2(plug-1) | 27317 | --shardsvr --replSet "rs_shard2" |
| shard3_s1 | ip3(plug-8) | 27417 | --shardsvr --replSet "rs_shard3" |
| mongos1 | ip1 | 27517 | --configdb rs_config_server/ip1:27117 |



```
# shard
mongo  -port 27018 -u rootuser -p rootpas


#进行分片
rs.initiate(
{
_id : "rs_shard1",
members: [
{ _id : 0, host : "ip1:27217" }
]
}
);

rs.initiate(
{
_id : "rs_shard2",
members: [
{ _id : 0, host : "ip2:27317" }
]
}
);


rs.initiate(
{
_id : "rs_shard3",
members: [
{ _id : 0, host : "ip3:27417" }
]
}
);
```



```
# config
mongo -port 27019 -u rootuser -p rootpas

#初始化
rs.initiate(
{
_id: "rs_config_server",
configsvr: true,
members: [
{ _id : 0, host : "ip1:27117" }
]
}
);

```



```
# mongos1
mongo -u rootuser -p rootpas


sh.addShard("rs_shard1/ip1:27217")
sh.addShard("rs_shard2/ip2:27317")
sh.addShard("rs_shard3/ip3:27417")
```

