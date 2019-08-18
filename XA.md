# XA what ?

```
XA规范是开放群组关于分布式事务处理 (DTP)的规范。
规范描述了全局的事务管理器与局部的资源管理器之间的接口。
XA规范的目的是允许多个资源（如数据库，应用服务器，消息队列，等等）在同一事务中访问，
这样可以使ACID属性跨越应用程序而保持有效。
XA使用两阶段提交来保证所有资源同时提交或回滚任何特定的事务。

X/Open DTP模型（1994）包括
应用程序（AP）、
事务管理器（TM）通常是数据库、
资源管理器（RM）、
通信资源管理器（CRM）
四部分。
```

## mysql XA 

```
[http://mysql.taobao.org/monthly/2017/09/05/] 
[https://dev.mysql.com/doc/refman/5.7/en/xa-statements.html]
xa_start负责开启或者恢复一个事务分支，并且管理XID到调用线程
xa_end 负责取消当前线程与事务分支的关联
xa_prepare负责询问RM 是否准备好了提交事务分支
xa_commit通知RM提交事务分支
xa_rollback 通知RM回滚事务分支
```

### 2pc
```sql

create table test(a int primay key, b int) engine = innodb;
# 不分库 本地事务
begin;
insert into test values (1, 1);
update test set b = 1 where a = 10;
commit;

# 分库 XA事务  a=1在分库1 ， a=10 在分库2
# 分库1
xa start ‘xid1’;  # xid1 全局事务id 开启一个XA事务
insert into values(1,1);
# 分库2
xa start ‘xid1’;
update test set b = 1 where a = 10;
# 分库1和分库2都执行
xa end ‘xid1’; 
xa prepare ‘xid1’;
# prepare都成功 ,分库都执行 
xa commit ‘xid1’;
# prepare有一个异常
xa rollback ‘xid1’;
```

### TCC TODO


