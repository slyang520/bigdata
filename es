elasticsearch  
索引
  （名词）
   一个 索引 类似于传统关系数据库中的一个 数据库 ，是一个存储关系型文档的地方。
   (动词)
   索引一个文档 就是存储一个文档到一个 索引 （名词）中以便它可以被检索和查询到。这非常类似于 SQL 语句中的 INSERT 关键词，除了文档已存在时新文档会替换旧文档情况之外。

1: 索引一个文档 (向es插入值)
curl -X PUT "localhost:9200/megacorp/employee/1" -H 'Content-Type: application/json' -d'
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
'
megacorp 索引名称
employee 类型名称
1 特定雇员的ID
