#SearchApi
实现对es存储的数据进行查询分析,endpoint为_search.

```
GET /_search
对es所有的数据进行查询
```

```
GET /my_index/_search
对es单个索引的数据进行查询
```

```
GET /my_index1,my_index2/_search
对es多个索引的数据进行查询
```

```
GET /my_*/_search
指定索引通配符对多个索引中的数据进行查询
```

##查询的2中形式

###URI Search (构建简单查询)
```
GET /my_index/_search?q=user:slyang 

GET /my_index/_search?q=slyangd&df=user&sort=age:asc&from=4&size=10&timeout=1s
q    指定查询语句
df   q中没有指定查询字段时默认查询的字段，es会查询所有字段 
sort  排序
timeout 指定超时时间
from,size 
查询user字段 包含slyang的文档，按年龄升序，返回5-15个文档 1s超时
```
### RequestBody Search (构建复杂查询)
```
curl -H 'Content-Type: application/json' -X GET localhost:9200/first_index/this_index_type/_search -d '{ "query":{ "term":{ "_id":"1"}}}'
```
```json
{
    "took": 21,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": 1,
        "hits": [
            {
                "_index": "first_index",
                "_type": "this_index_type",
                "_id": "1",
                "_score": 1,
                "_source": {
                    "first_name": "John",
                    "last_name": "Smith",
                    "age": 25
                }
            }
        ]
    }
}
```
```
took 查询耗时：单位ms
hits.total 符合文档的总文档数
hits.hits 返回文档详情数据数组，默认前10个文档
hits.hits[x]._score 返回文档详情数据的得分 数越大匹配度越高 1 最大
```

#### RequestBody Search Body
```
body包含如下参数
query 符合Query DSL语法的查询语法
from
size
time
sort
和URL search 含义类似 结构大致如下所示
```
```json
{
    "query": {
        "term": {
            "_id": "1"
        }
    }
}
```
```
Query DSL 有2种类型

1.字段类查询
    term,match,range 只针对某一字段进行查询
字段类查询有2类
    全文匹配
        针对 text 类型的字段进行全文检索，会对查询的语句 先进行分词处理，如 match，match_phrase 。。
    单词匹配
        不会对查询语句做分词，直接去匹配字段的倒排索引，如 term,terms,range ...

2.复合查询
    如，bool查询，包含一个或多个字段的查询 或 复合查询  
复合查询主要一下几类
constant_score_query
bool query
dis_max query
function_score query
boosting query
```

Match Query
```json
{
    "explain": true,
    "profile": true,
    "query": {
        "match": {
            "username": "alfred way"
        }
    }
}
```
```
含义是  文档里面username字段含有 alfred 或 way的文档
"profile": true （用作调试）可以知道查询过程 
"explain": true, 调试追踪 获取匹配得分
```
```json
{
    "query": {
        "match": {
            "username": {
                "query": "alfred way",
                "operator": "and"
            }
        }
    }
}
```
```
含义是  文档里面username字段含有 alfred 和 way的文档
operator = and 且
operator = or 或
还可以添加参数 minmum_should_match  =2 
表示搜寻出现的次数
```

Match Phrase Query
对字段进行检索，有顺序要求
```json
{
    "query": {
        "match_phrase": {
            "job": "java engineer"
        }
    }
}
```
```
文档包含 java engineer 但是顺序要一致
java c php engineer 匹配
engineer java c php 不匹配
```

Query String Query
```json
{
    "query": {
        "query_string": {
                "default_filed": "username",
                "query":"alfred AND way",
        }
    }
}
```
```
文档中 username 字段同时包含 alfred 和 way
```
```json
{
    "query": {
        "query_string": {
                "fields": [
                    "username",
                    "job"
                ],
                "query":"alfred OR (java AND ruby)",
        }
    }
}
```

Term Query
将整个语句作为整个单词进行查询，不会对查询语句作分词

```json
{
    "query": {
        "term": {
            "username": "alfred"
        }
    }
}
```
```
从倒排索引中查询 username 包含 alfred 的文档
```
```json
{
    "query": {
        "term": {
            "username": "alfred way"
        }
    }
}
```
```
从倒排索引中查询 username 包含 alfred way 的文档
alfred way 不匹配 因为经过分词了  没有这2 个单词
```

Terms Query
```json
{
    "query": {
        "terms": {
            "username": [
                "alfred",
                "way"
            ]
        }
    }
}
```
```
提供多个查询词，以数组形式出现，查询指定的字段是否包含其中一个或者多个查询词；
```

Range Query
针对数值和日期的 范围查询
```json
{
    "query": {
        "range": {
            "age": {
                "gte": 10,
                "lte": 20
            }
        }
    }
}
```
```
年龄大于等于10 小于等于20
```
```json
{
    "query": {
        "range": {
            "birth": {
                "gte": "1999-10-10",
            }
        }
    }
}
```

###复合查询

constant_score_query
```
该查询将期内部的查询结果文档得分都设定为1 或 boost 的值
多结合bool 查询实现自定义分
```
```json
{
    "query": {
        "constant_score": {
            "filter": {
                "match": {
                    "username": "alfred"
                }
            }
        }
    }
}
```
```
和match 结果一样 得分都为1
```
bool query
```
由一个 或 多个 布尔子句组成
```

过滤条件|说明
:---:|:----:|:----:|:---:
filter|只过滤符合条件的文档，不计算相关性得分
must|文档必须符合must中的所有条件，会影响相关性得分
must not| 文档不符合must not中的所有条件
should| 文档可以符合 should中的所有条件，会影响相关性得分
```json
{
    "query": {
        "bool": {
            "must": [
                {}
            ],
            "must_not": [
                {}
            ],
            "should": [
                {}
            ],
            "filter": [
                {}
            ]
        }
    }
}
```
```
should使用分两种情况
    bool查询只包含 should，不包含 must
    bool查询同时包含 should 和 must
```
```json
{
    "query": {
        "bool": {
            "should": [
                {
                    "term": {
                        "job": "java"
                    }
                },
                {
                    "term": {
                        "job": "php"
                    }
                },
                {
                    "term": {
                        "job": "c++"
                    }
                }
            ],
            "minimum_should_match": 2
        }
    }
}
```
```
只包含should 文档必须至少满足一个条件
minimum_should_match 控制should 至少满足的条件数量
```
```
同时包含 must should 文档不必满足 should 条件也可以 
但是 满足 should 条件相关性得分会提高
```
## 查询返回字段过滤
```
不返回
```
```json
{
    "_source": false,
    "query": {}
}
```
```
只返回username,age字段
```
```json
{
    "_source": [
        "username",
        "age"
    ],
    "query": {}
}
```
```
只返回inlucdes字段
排除 excludes
```
```json
{
    "_source": {
       "inlucdes":"i*",
       "excludes":"password",      
    },
    "query": {}
}
```




#CountApi
获取符合条件的文档数量,endpoint为_count.查询和SearchAPI一样当时只返回数量
```json
{
    "count": 3,
    "_shards": {}
}
```