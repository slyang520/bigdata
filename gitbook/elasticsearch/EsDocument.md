# Document 文档
用户存储在es中的数据，类似与数据库1行数据

## 文档的组成
JSON Object,由字段组成
常见的字段类型：
```
字符串：text,keyword
       注：text是分词的，keyword不分词   
数值： long,integer,short,byte,double,float,half_float,scaled_float
布尔： boolean
日期： date
二进制： binary
范围类型： integer_range,float_range,long_range,double_range,date_range

```
## MetaData 文档的元数据
用于标示文档的相关信息
```
_index 文档所在的索引
_type 文档所在的类型（6.x,该字段被弃用，所有的索引有且只有一个默认索引 ）
_id 文档唯一标示
_uid
_source 文档存储的原始json数据
_all 整合所有字段内容到该字段，默认禁用
```
