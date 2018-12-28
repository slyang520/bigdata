# RestApi
elasticsearch 对外提供的api 接口



## Index API
用于对索引的创建，删除,更新

### 创建索引
```
curl -X PUT localhost:9200/create_my_first_index
create_my_first_index 为索引名,成功响应如下:
```
``` json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "create_my_first_index"
}
```
### 查询索引
```
curl -X GET localhost:9200/_cat/indices
查询所有的索引
```
```
yellow open product                    fB_xEepFQV65stYxORg0JA 5 1    3 0  12.7kb  12.7kb
yellow open firstin                    PjtJcPN-QYqcbnU8VFftzQ 5 1    0 0   1.2kb   1.2kb
yellow open create_my_first_index      2VvfA7CYScek-HiJ3eXILw 5 1    0 0   1.2kb   1.2kb
```
### 删除索引
```
curl -X DELETE localhost:9200/create_my_first_index
```
``` json
{"acknowledged":true}
```


## Document API
用于对文档的增,删,改,查

### 创建文档
注意：创建文档如果索引，类型不存在,则会自动创建

#### 创建一个文档(指定id)
```
curl -H 'Content-Type: application/json' -X PUT localhost:9200/first_index/this_index_type/1 -d '{ "first_name" : "John","last_name" : "Smith","age" : 25}'

first_index 对应索引
this_index_type 对应索引的类型 (6.x后弱化类型功能)
1 为文档的唯一标识

```
```json
{
    "_index": "first_index",
    "_type": "this_index_type",
    "_id": "1",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```
#### 创建一个文档(不指定id)
```
curl -H 'Content-Type: application/json' -X POST localhost:9200/first_index/this_index_type -d '{ "first_name" : "John","last_name" : "Smith","age" : 25}'
```

```json
{
    "_index": "first_index",
    "_type": "this_index_type",
    "_id": "US2avGcBfXUrf-aoENz0",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```
#### 批量创建文档 (TODO  update script 操作)
endpoint 为 _bulk
```
curl -H 'Content-Type: application/json' -X POST localhost:9200/_bulk -d' 
{ "update": { "_index": "first_index", "_type": "this_index_type", "_id": "1"} }
{ "doc" : {"last_name" : "this is my update last_name"} }
{ "index": {"_index": "first_index","_type": "this_index_type","_id": "3"}}
{ "first_name" : "John","last_name" : "this is last name","age" : 25}
'

语法结构如下
action_and_meta_data\n
optional_source\n
action_and_meta_data\n
optional_source\n

其中 action 需要是 index, create, delete and update 中的一个。

index
创建一个新文档或者替换一个现有的文档。 不存在新建，存在替换，如果不指定 _id ，将会自动生成一个 ID
{ "index": {"_index": "first_index","_type": "this_index_type","_id": "1"}}
{ "first_name" : "John","last_name" : "this is last name","age" : 25}

create
如果文档不存在，那么就创建它。 不存在新建，存在错误提示
{ "create": {"_index": "first_index","_type": "this_index_type","_id": "1"}}
{ "first_name" : "John","last_name" : "create this is last name","age" : 25}

update
部分更新一个文档。 (request body 为 doc, 也可设置成script 完成复杂更新 案例待补充)
{ "update": { "_index": "first_index", "_type": "this_index_type", "_id": "1"} }
{ "doc" : {"last_name" : "this is my update last_name"} }

delete
删除一个文档。无请求体
{ "delete": { "_index": "first_index", "_type": "this_index_type", "_id": "2"} }

```


### 查询文档
#### 指定id查询
```
curl -X GET localhost:9200/first_index/this_index_type/1

first_index  索引
this_index_type 索引类型
1 文档ID

下面分别展示:
1 有文档  http_staus: 200
2 无文档  http_staus: 404
```
```json
{
    "_index": "first_index",
    "_type": "this_index_type",
    "_id": "1",
    "_version": 2,
    "found": true,
    "_source": {
        "first_name": "John",
        "last_name": "Smith",
        "age": 25
    }
}

```
```json
{
    "_index": "first_index",
    "_type": "this_index_type",
    "_id": "2",
    "found": false
}
```

#### 批量查询 endpoint 为 _mget 指定多个ID 

```
curl -H 'Content-Type: application/json' -X GET localhost:9200/_mget -d '{ "docs": [ { "_index": "first_index", "_type": "this_index_type", "_id": "1"},{"_index": "first_index","_type": "this_index_type","_id": "2"}]}'

```
```json
{
    "docs": [
        {
            "_index": "first_index",
            "_type": "this_index_type",
            "_id": "1",
            "_version": 2,
            "found": true,
            "_source": {
                "first_name": "John",
                "last_name": "Smith",
                "age": 25
            }
        },
        {
            "_index": "first_index",
            "_type": "this_index_type",
            "_id": "2",
            "found": false
        }
    ]
}
```

#### [查询所有文档，需要_search](SearchApi.html)



## Analyzer API
es 提供一个测试分词的API，方便验证分词效果，endpoint 是 _analyze
```
可以直接指定 分词器测试
可以指定索引中的字段测试
可以自定义分词器测试
```
### 指定 分词器测试

```
curl -H 'Content-Type: application/json' -X POST localhost:9200/_analyze -d '{"analyzer": "standard", "text": "hello world,java"}'

analyzer : standard   指定分词器（为系统默认自带的分词器）
text : hello world,java 指定分词文本
响应如下：
```
```json
{
    "tokens": [
        {
            "token": "hello",
            "start_offset": 0,
            "end_offset": 5,
            "type": "<ALPHANUM>",
            "position": 0
        },
        {
            "token": "world",
            "start_offset": 6,
            "end_offset": 11,
            "type": "<ALPHANUM>",
            "position": 1
        },
        {
            "token": "java",
            "start_offset": 12,
            "end_offset": 16,
            "type": "<ALPHANUM>",
            "position": 2
        }
    ]
}
```

### 指定 索引中的字段测试
```
curl -H 'Content-Type: application/json' -X POST localhost:9200/first_index/_analyze -d '{"field": "first_name", "text": "hello world,java"}'

field : first_name   指定的是first_index 下的字段
text : hello world,java 指定分词测试文本
响应如下：
```

```json
{
    "tokens": [
        {
            "token": "hello",
            "start_offset": 0,
            "end_offset": 5,
            "type": "<ALPHANUM>",
            "position": 0
        },
        {
            "token": "world",
            "start_offset": 6,
            "end_offset": 11,
            "type": "<ALPHANUM>",
            "position": 1
        },
        {
            "token": "java",
            "start_offset": 12,
            "end_offset": 16,
            "type": "<ALPHANUM>",
            "position": 2
        }
    ]
}
```

### 可以自定义分词器测试 (TODO)



