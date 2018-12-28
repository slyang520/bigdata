#Aggregations
聚合分析 es除搜索功能提供针对es数据做统计分析的功能 类似于数据库group by


## 平局聚合

```
求汽车的平局价格
size 为0 让其hits 为空
```
```
POST  /cars/transactions/_search
{
    "size" : 0,
    "aggs": {
        "avg_grade": {
            "avg": {
                "field": "price"
            }
        }
    }
}
```
```json
{
    "took": 8,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 8,
        "max_score": 0,
        "hits": []
    },
    "aggregations": {
        "avg_grade": {
            "value": 26500
        }
    }
}
```

```
聚合平局值  用脚本的方式
```

```


```

## 计数聚合
```
获取汽车有几个颜色

```
对计数聚合的字段 如果是 text 分词类型的需要设置
PUT cars/_mapping/transactions
{
  "properties": {
    "interests": { 
      "color":     "text",
      "fielddata": true
    }
  }
}
fielddata 为true 5.x 后默认为false
```
POST cars/transactions/_search?size=0
{
    "aggs": {
        "type_count": {
            "cardinality": {
                "field": "color"
            }
        }
    }
}
````

```json
{
    "took": 8,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 8,
        "max_score": 0,
        "hits": []
    },
    "aggregations": {
        "type_count": {
            "value": 3
        }
    }
}
```


### 扩展统计聚合
一种multi-value度量聚合，用于计算从聚合文档中提取的数值的统计信息。
可以从文档中的特定数字字段提取这些值，也可以通过提供的脚本生成这些值。

```
字段必须是数值类型
```
```
POST cars/transactions/_search?size=0

{
    "size" : 0,
    "aggs": {
        "avg_grade": {
            "extended_stats": {
                "field": "price"
            }
        }
    }
}
```
```json
{
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 8,
        "max_score": 0,
        "hits": []
    },
    "aggregations": {
        "avg_grade": {
            "count": 8,
            "min": 10000,
            "max": 80000,
            "avg": 26500,
            "sum": 212000,
            "sum_of_squares": 9194000000,
            "variance": 447000000,
            "std_deviation": 21142.374511865975,
            "std_deviation_bounds": {
                "upper": 68784.74902373194,
                "lower": -15784.74902373195
            }
        }
    }
}
```


## 地理边界聚合