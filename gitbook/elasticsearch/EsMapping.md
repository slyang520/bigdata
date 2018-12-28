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

