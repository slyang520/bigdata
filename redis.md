# redis持久化
```
redis提供了两种持久化的方式，分别是RDB（Redis DataBase）和AOF（Append Only File）。
```

## 1.RDB
```
RDB是一种快照存储持久化方式，具体就是将Redis某一时刻的内存数据保存到硬盘的文件当中，
默认保存的文件名为dump.rdb
```
## 1.2 手动触发
### 1.2.1 SAVE  
```
客户端提交此命令
保存内存数据到磁盘 【此命令是同步】
```
### 1.2.2 BGSAVE  
```
客户端提交此命令
保存内存数据到磁盘 【此命令是异步 fork一个子进程来保存数据】
```
## 1.3 配置自动触发

```conf
# 在配置文件 redis.conf 配置如下

# 900s内至少达到一条写命令
save 900 1
# 300s内至少达至10条写命令
save 300 10
# 60s内至少达到10000条写命令
save 60 10000


# 启动服务器加载配置文件
redis-server redis.conf
# bgsave 同save 配置

```

## 2.AOF

```
AOF持久化方式会记录客户端对服务器的每一次写，删操作命令，
并将这些写操作以Redis协议追加保存到以后缀为aof文件末尾，
在Redis服务器重启时，会加载并运行aof文件的命令，以达到恢复数据的目的。
```
### 2.1 开启配置

```
# 开启aof机制
appendonly yes

# aof文件名
appendfilename "appendonly.aof"

# 写入策略,always表示每个写操作都保存到aof文件中,也可以是everysec或no
appendfsync always

# 默认不重写aof文件
no-appendfsync-on-rewrite no

```

### 2.1.1 写入策略
```
1. always
客户端的每一个写操作都保存到aof文件当，这种策略很安全，但是每个写请注都有IO操作，所以也很慢。
2. everysec
appendfsync的默认写入策略，每秒写入一次aof文件，因此，最多可能会丢失1s的数据。
3. no
Redis服务器不负责写入aof，而是交由操作系统来处理什么时候写入aof文件。更快，但也是最不安全的选择，不推荐使用。

```


