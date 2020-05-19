# Mapping
定义Index下 字段名，字段类型，定义字段倒排索引相关配置，比如是否索引。

## 查询索引的mapping
```
curl -H 'Content-Type: application/json' -X GET localhost:9200/first_index/_mapping 

```

```json
{
    "first_index": {
        "mappings": {
            "this_index_type": {
                "properties": {
                    "age": {
                        "type": "long"
                    },
                    "first_name": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "last_name": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## 创建索引的mapping
```
curl -H 'Content-Type: application/json' -X PUT localhost:9200/second_index -d '{"mappings":{"this_index_type":{"properties":{"age":{"type":"long"},"first_name":{"type":"text"},"last_name":{"type":"keyword"}}}}}'

Mapping中的字段类型设定后无法修改
可以重新建立新的索引，然后reindex (相当于把数据重新导入)
允许新增字段， 通过dynamic  
true(默认) 允许自动新增字段
false 不允许新增字段，但是文档可以正常写入，无法对字段进行查询。。
strict 文档写入报错
```
```json
{"acknowledged":true,"shards_acknowledged":true,"index":"second_index"}
```


## mapping copy_to

## mapping index
控制当前字段是否索引 默认true   false,不可搜索
```json
{
    "properties": {
        "test_filed_name": {
            "type": "text",
            "index": false
        }
    }
}
```

## 新建索引
```
PUT my_index
{
  "mappings": {
    "my_type": {
      "properties": {
        "title": {
          "type":  "text"
        }
      }
    }
  }
}

```


## 文档字段类型


字符串类型 text,keyword
```
string × 该类型在5.x后删除

text    当一个字段需要被全文索引时设置为此字段,
        存储全文搜索数据, 例如: 邮箱内容、日志内容、地址、代码块、博客文章内容等。默认结合standard analyzer(标准解析器)对文本进行分词、倒排索引。
        text类型的字段不用于排序，很少用于聚合（termsAggregation除外）

keyword keyword类型的字段只能通过精确值搜索到。
        不进行分词，直接索引,支持模糊、支持精确匹配，支持聚合、排序操作。
        用于存储邮箱号码、手机号码、主机名、状态码、邮政编码、标签、年龄、性别等数据。
        用于筛选数据(例如: select * from x where status='open')、排序、聚合(统计)。
        直接将完整的文本保存到倒排索引中。
        
        

以下让keyword字段也有被全文检索的能力
{
    "type": "keyword",
    "fields": {
        "make_title_searchable": {
            "type": "text"
        }
    }
}

{
    "query": {
        "match": {
            "title.make_title_searchable": "ElasticSearch"
        }
    }
}
        
```




