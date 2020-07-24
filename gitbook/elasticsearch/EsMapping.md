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
### 复杂场景的新建索引

```json
1：title: text
2: title_keyword: keyword
3: title_keyword_text: keyword,text

4: text_ik_max_word :分词插件(ik_max_word)
5：text_ik_smart：分词插件(ik_smart)

{
    "mappings": {
        "_doc": {
            "properties": {
                "title": {
                    "type": "text"
                },
                "title_keyword": {
                    "type": "keyword"
                },
                "title_keyword_text": {
                    "type": "keyword",
                    "fields": {
                        "make_title_searchable": {
                            "type": "text"
                        }
                    }
                },
                "text_ik_max_word": {
                    "type": "text",
                    "analyzer": "ik_max_word"
                },
                "text_ik_smart": {
                    "type": "text",
                    "analyzer": "ik_smart"
                },
                "text_standard": {
                    "type": "text",
                    "analyzer": "standard"
                 }
            }
        }
    }
}
```

### 测试分词效果

```
es >=6

POST  _analyze/?pretty
{
  "analyzer": "ik_max_word",
  "text": "测试用例"
}


{
    "tokens": [
        {
            "token": "测试",
            "start_offset": 0,
            "end_offset": 2,
            "type": "CN_WORD",
            "position": 0
        },
        {
            "token": "试用",
            "start_offset": 1,
            "end_offset": 3,
            "type": "CN_WORD",
            "position": 1
        },
        {
            "token": "例",
            "start_offset": 3,
            "end_offset": 4,
            "type": "CN_CHAR",
            "position": 2
        }
    ]
}

es<6
/_analyze?analyzer=ik_max_word&text=测试用例

{
    "tokens": [
        {
            "token": "测试",
            "start_offset": 0,
            "end_offset": 2,
            "type": "CN_WORD",
            "position": 0
        },
        {
            "token": "试用",
            "start_offset": 1,
            "end_offset": 3,
            "type": "CN_WORD",
            "position": 1
        },
        {
            "token": "例",
            "start_offset": 3,
            "end_offset": 4,
            "type": "CN_CHAR",
            "position": 2
        }
    ]
}

```









